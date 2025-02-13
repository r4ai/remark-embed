/**
 * @module
 * This module exports the remark-embed plugin and related types.
 *
 * @example
 * ```ts
 * import rehypeStringify from "rehype-stringify"
 * import remarkParse from "remark-parse"
 * import remarkRehype from "remark-rehype"
 * import { unified } from "unified"
 * import remarkEmbed from "./src/index.js"
 * import { transformerOEmbed } from "./src/transformers"
 *
 * const md = `
 * <https://www.youtube.com/watch?v=jNQXAC9IVRw>
 * `
 *
 * const html = (
 *   await unified()
 *     .use(remarkParse)
 *     .use(remarkRehype)
 *     .use(remarkEmbed, {
 *       transformers: [transformerOEmbed()],
 *     })
 *     .use(rehypeStringify)
 *     .process(md)
 * ).toString()
 *
 * console.log(html)
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

export type { Transformer } from "./transformer.js"
export {
  defaultRemarkEmbedOptions,
  remarkEmbed as default,
  remarkEmbed,
  type RemarkEmbedOptions,
} from "./plugin.js"
