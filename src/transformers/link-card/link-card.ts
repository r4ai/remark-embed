import { defu } from "defu"
import type { DeepReadonly, DeepRequired } from "ts-essentials"
import { unfurl } from "unfurl.js"
import type { Transformer } from "../../index.js"
import type { Element } from "../utils.js"
import { htmlPreset } from "./presets/html.js"

type Metadata = Partial<Awaited<ReturnType<typeof unfurl>>>

/**
 * The information about a link.
 */
export type LinkInfo = {
  /**
   * The URL of the link.
   */
  url: string

  /**
   * The title of the link.
   */
  title?: string

  /**
   * The description of the link.
   */
  description?: string

  /**
   * The URL of the favicon.
   */
  favicon?: string

  /**
   * The image of the link.
   */
  image: {
    /**
     * The URL of the image.
     */
    src?: string

    /**
     * The alternative text of the image.
     */
    alt?: string
  }
}

/**
 * The options for the {@link transformerLinkCard}.
 */
export type TransformerLinkCardOptions = {
  /**
   * The HTML tag name of the link card.
   */
  tagName?:
    | ((info: DeepReadonly<LinkInfo>) => Element["tagName"])
    | ((info: DeepReadonly<LinkInfo>) => Promise<Element["tagName"]>)

  /**
   * The HTML properties of the link card.
   */
  properties?:
    | ((info: DeepReadonly<LinkInfo>) => Element["properties"])
    | ((info: DeepReadonly<LinkInfo>) => Promise<Element["properties"]>)

  /**
   * The children of the link card.
   */
  children?:
    | ((info: DeepReadonly<LinkInfo>) => Element["children"])
    | ((info: DeepReadonly<LinkInfo>) => Promise<Element["children"]>)
}

/**
 * The default options for the {@link transformerLinkCard}.
 */
export const defaultTransformerLinkCardOptions =
  htmlPreset() satisfies DeepRequired<DeepReadonly<TransformerLinkCardOptions>>

/**
 * A transformer to generate link cards.
 * Generates a link card for a URL using the Open Graph metadata.
 *
 * @example
 * ```ts
 *  const html = (
 *   await unified()
 *     .use(remarkParse)
 *     .use(remarkRehype)
 *     .use(remarkEmbed, {
 *       transformers: [transformerLinkCard()],
 *     })
 *     .use(rehypeStringify)
 *     .process("<https://r4ai.dev/posts/docker_tutorial/>")
 * ).toString()
 * ```
 * Yield:
 * ```html
 * <p>
 *   <a href="https://r4ai.dev/posts/docker_tutorial/" class="link-card" target="_blank" rel="noopener noreferrer">
 *       <div class="link-card__container">
 *           <div class="link-card__info">
 *               <div class="link-card__title">Docker 入門 | r4ai.dev</div>
 *               <div class="link-card__description">Tech blog by Rai</div>
 *               <div class="link-card__link">
 *                   <img class="link-card__favicon" src="https://r4ai.dev/favicon.svg" alt="Favicon for r4ai.dev" loading="lazy" decoding="async">
 *                   <span class="link-card__hostname">r4ai.dev</span>
 *               </div>
 *           </div>
 *           <div class="link-card__image">
 *             <img src="https://r4ai.dev/posts/docker_tutorial/ogimage.png" loading="lazy" decoding="async">
 *           </div>
 *       </div>
 *   </a>
 * </p>
 * ```
 */
export const transformerLinkCard = (
  _options?: DeepReadonly<TransformerLinkCardOptions>,
): Transformer => {
  const options = defu(_options, defaultTransformerLinkCardOptions)
  const cache = new Map<string, Metadata>()

  return {
    name: "link-card",
    match: async (url) => {
      const metadata = cache.get(url.href) ?? (await unfurl(url.href))
      if (metadata == null) return false

      cache.set(url.href, metadata)
      return true
    },
    tagName: async (url) => {
      const metadata = cache.get(url.href)
      if (metadata == null) throw new Error("No metadata found for URL")

      const tagName = await options.tagName(getUrlInfo(url, metadata))
      return tagName
    },
    properties: async (url) => {
      const metadata = cache.get(url.href)
      if (metadata == null) throw new Error("No metadata found for URL")

      const properties = await options.properties(getUrlInfo(url, metadata))
      return properties
    },
    children: async (url) => {
      const metadata = cache.get(url.href)
      if (metadata == null) throw new Error("No metadata found for URL")

      const children = await options.children(getUrlInfo(url, metadata))
      return children
    },
  }
}

const getUrlInfo = (url: URL, metadata: Metadata) => ({
  url: metadata.open_graph?.url ?? url.href,
  title:
    metadata.open_graph?.title ??
    metadata.title ??
    metadata.twitter_card?.title,
  description:
    metadata.open_graph?.description ??
    metadata.description ??
    metadata.twitter_card?.description,
  favicon: metadata.favicon,
  image: {
    src:
      metadata.open_graph?.images?.at(0)?.url ??
      metadata.twitter_card?.images?.at(0)?.url,
    alt:
      metadata.open_graph?.images?.at(0)?.alt ??
      metadata.twitter_card?.images?.at(0)?.alt,
  },
})
