import type * as hast from "hast"
import type * as mdast from "mdast"
import rehypeStringify from "rehype-stringify"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"
import { type RemarkEmbedOptions, remarkEmbed } from "../index.js"

export const md2html = async (md: string, options: RemarkEmbedOptions) => {
  let hast: hast.Node
  let mdast: mdast.Root
  const html = (
    await unified()
      .use(remarkParse)
      .use(remarkEmbed, options)
      .use(() => (tree: mdast.Root) => {
        mdast = tree
        return mdast
      })
      .use(remarkRehype)
      .use(() => (tree: hast.Node) => {
        hast = tree
        return hast
      })
      .use(rehypeStringify)
      .process(md)
  ).toString()
  // @ts-expect-error hast and mdast are not undefined
  return { hast, mdast, html }
}
