/**
 * @module
 * This module exports the transformers for the remark-embed plugin.
 *
 * @example
 * Use the `transformerOEmbed` to embed the link using the oEmbed metadata.
 *
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
 */

export type { Element } from "./utils.js"
export {
  type OEmbedLink,
  type OEmbedPhoto,
  type OEmbedRich,
  type OEmbedVideo,
  type TransformerOEmbedOptions,
  defaultTransformerOEmbedOptions,
  transformerOEmbed,
} from "./oembed/index.js"
export {
  type LinkInfo,
  type TransformerLinkCardOptions,
  defaultTransformerLinkCardOptions,
  transformerLinkCard,
} from "./link-card/index.js"
