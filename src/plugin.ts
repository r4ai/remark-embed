import { defu } from "defu"
import type { Root } from "mdast"
import type { Plugin } from "unified"
import { visit } from "unist-util-visit"
import type { Transformer } from "./index.ts"

/**
 * Options for the {@link remarkEmbed} plugin.
 */
export type RemarkEmbedOptions = {
  /**
   * A list of transformers.
   * Each transformer is executed in sequence from beginning to end.
   * @see {@link Transformer}
   */
  transformers: Transformer[]
}

/**
 * Default options for the {@link remarkEmbed} plugin.
 */
export const defaultRemarkEmbedOptions: Readonly<RemarkEmbedOptions> = {
  transformers: [],
}

/**
 * A remark plugin to embed the content of the URL.
 *
 * @example
 * ```ts
 * import { unified } from "unified";
 * import remarkParse from "remark-parse";
 * import remarkRehype from "remark-rehype";
 * import remarkEmbed from "@r4ai/remark-embed";
 * import { transformerOEmbed } from "@r4ai/remark-embed";
 * import rehypeStringify from "rehype-stringify";
 * import { Graphviz } from "@hpcc-js/wasm";
 *
 * const md = `
 * <https://www.youtube.com/watch?v=jNQXAC9IVRw>
 * `;
 *
 * const html = unified()
 *   .use(remarkParse)
 *   .use(remarkRehype)
 *   .use(remarkEmbed, {
 *     transformers: [transformerOEmbed()],
 *   })
 *   .use(rehypeStringify)
 *   .processSync(md)
 *   .toString();
 *
 * console.log(html);
 * ```
 *
 * Yields:
 *
 * ```html
 * <p>
 *   <div class="oembed-video">
 *     <iframe
 *       width="200"
 *       height="150"
 *       src="https://www.youtube.com/embed/jNQXAC9IVRw?feature=oembed"
 *       frameborder="0"
 *       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
 *       referrerpolicy="strict-origin-when-cross-origin"
 *       allowfullscreen
 *       title="Me at the zoo">
 *     </iframe>
 *   </div>
 * </p>
 * ```
 */
export const remarkEmbed: Plugin<
  [(RemarkEmbedOptions | null | undefined)?],
  Root
> = (_options) => {
  const options = defu(_options, defaultRemarkEmbedOptions)

  return async (tree, file) => {
    const transforming: Promise<void>[] = []

    visit(tree, "link", (link, index, paragraph) => {
      // Check if the paragraph only contains a single url link
      // e.g. OK: `https://example.com/hoge`
      //      NG: `according to example.com/hoge`
      //      NG: `[example](https://example.com/hoge)`
      if (
        paragraph?.type !== "paragraph" ||
        paragraph.children.length !== 1 ||
        (link.data?.hName != null && link.data?.hName !== "a") ||
        link.children.length !== 1 ||
        link.children[0].type !== "text" ||
        link.children[0].value !== link.url
      ) {
        return
      }

      const url = new URL(link.url)

      const transform = async () => {
        for (const transformer of options.transformers) {
          try {
            if (!(await transformer.match(url))) continue

            if (!link.data) link.data = {}

            link.data.hName = await getHName(transformer, url)
            link.data.hProperties = {
              ...(link.data?.hProperties ?? {}),
              ...(await getHProperties(transformer, url)),
            }
            link.data.hChildren = await getHChildren(transformer, url)
            return
          } catch (e) {
            const msg = `[transformer:${transformer.name}] Failed to embed ${link.url} in ${file.path} at line ${link.position?.start?.line}.`
            file.message(
              `${msg}; ${JSON.stringify(e)}`,
              link.position,
              "@r4ai/remark-embed",
            )
          }
        }
      }
      transforming.push(transform())
    })

    await Promise.all(transforming)
  }
}

const getHName = async (transformer: Transformer, url: URL) => {
  if (typeof transformer.tagName === "function") {
    return transformer.tagName(url)
  }
  return transformer.tagName
}

const getHProperties = async (transformer: Transformer, url: URL) => {
  if (typeof transformer.properties === "function") {
    return transformer.properties(url)
  }
  return transformer.properties
}

const getHChildren = async (transformer: Transformer, url: URL) => {
  if (typeof transformer.children === "function") {
    return transformer.children(url)
  }
  return transformer.children
}
