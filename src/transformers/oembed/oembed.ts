import { defu } from "defu"
import type { ElementContent } from "hast"
import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic"
import { unfurl } from "unfurl.js"
import * as v from "valibot"
import type { Transformer } from "../../index.js"
import type { DeepReadonly, DeepRequired } from "../utils.js"
import type { Element } from "../utils.js"
import type {
  OEmbed,
  OEmbedLink,
  OEmbedPhoto,
  OEmbedRich,
  OEmbedVideo,
} from "./schemas.js"
import { OEmbedSchema } from "./schemas.js"

export type TransformerOEmbedOptions = {
  /**
   * The providers to fetch oEmbed data from specific services.
   *
   * @defaultValue {@link defaultTransformerOEmbedOptions.providers}
   */
  providers?: Record<
    string,
    {
      /**
       * The URL matcher.
       * If the URL is matched, the transformer will be applied.
       *
       * @param url The URL to match.
       * @returns Whether the URL is matched.
       * @example (url) => url.hostname === "example.com"
       */
      match: (url: URL) => boolean

      /**
       * The function to fetch the oEmbed data for the URL.
       *
       * @param url The URL to fetch.
       * @returns Fetch response containing the oEmbed data for the URL.
       * @example (url) => fetch(`https://example.com/oembed?${new URLSearchParams({ url: url.href })}`)
       */
      response: (url: URL) => Promise<Response>
    }
  >

  /**
   * The post-processor for the HTML content to embed.
   * @param html The `html` field of the oEmbed metadata.
   * @returns The processed HTML content.
   */
  postProcess?: (html: string) => string

  /**
   * The transformer for the photo type of oEmbed.
   *
   * @see https://oembed.com/#:~:text=2.3.4.1.%20The%20photo%20type
   * @param url The URL to embed.
   * @param oEmbed The oEmbed metadata for the {@link url}
   * @param options The options for the {@link transformerOEmbed}
   * @returns The element to embed the photo.
   * @defaultValue {@link defaultTransformerOEmbedOptions.photo}
   */
  photo?: (
    url: URL,
    oEmbed: DeepReadonly<OEmbedPhoto>,
    options: DeepRequired<DeepReadonly<TransformerOEmbedOptions>>,
  ) => Element

  /**
   * The transformer for the video type of oEmbed.
   *
   * @see https://oembed.com/#:~:text=2.3.4.2.%20The%20video%20type
   * @param url The URL to embed.
   * @param oEmbed The oEmbed metadata for the {@link url}
   * @param options The options for the {@link transformerOEmbed}
   * @returns The element to embed the video.
   * @defaultValue {@link defaultTransformerOEmbedOptions.video}
   */
  video?: (
    url: URL,
    oEmbed: DeepReadonly<OEmbedVideo>,
    options: DeepRequired<DeepReadonly<TransformerOEmbedOptions>>,
  ) => Element

  /**
   * The transformer for the rich type of oEmbed.
   *
   * @see https://oembed.com/#:~:text=2.3.4.4.%20The%20rich%20type
   * @param url The URL to embed.
   * @param oEmbed The oEmbed metadata for the {@link url}
   * @param options The options for the {@link transformerOEmbed}
   * @returns The element to embed the rich content.
   * @defaultValue {@link defaultTransformerOEmbedOptions.rich}
   */
  rich?: (
    url: URL,
    oEmbed: DeepReadonly<OEmbedRich>,
    options: DeepRequired<DeepReadonly<TransformerOEmbedOptions>>,
  ) => Element

  /**
   * The transformer for the link type of oEmbed.
   *
   * @see https://oembed.com/#:~:text=2.3.4.3.%20The%20link%20type
   * @param url The URL to embed.
   * @param oEmbed The oEmbed metadata for the {@link url}
   * @param options The options for the {@link transformerOEmbed}
   * @returns The element to embed the link.
   * @defaultValue {@link defaultTransformerOEmbedOptions.link}
   */
  link?: (
    url: URL,
    oEmbed: DeepReadonly<OEmbedLink>,
    options: DeepRequired<DeepReadonly<TransformerOEmbedOptions>>,
  ) => Element
}

export const defaultTransformerOEmbedOptions: DeepRequired<
  DeepReadonly<TransformerOEmbedOptions>
> = {
  providers: {
    // https://developer.x.com/en/docs/x-for-websites/oembed-api
    "twitter.com": {
      match: (url) => url.hostname === "twitter.com",
      response: (url) =>
        fetch(
          `https://publish.twitter.com/oembed?${new URLSearchParams({ url: url.href })}`,
        ),
    },
  },
  postProcess: (html) => html,
  photo: (_, oEmbed) =>
    ({
      tagName: "img",
      properties: {
        src: oEmbed.url,
        width: oEmbed.width,
        height: oEmbed.height,
        alt: oEmbed.title,
        className: "oembed oembed-photo",
        href: null,
      },
      children: [],
    }) as const,
  video: (_, oEmbed, options) =>
    ({
      tagName: "div",
      properties: {
        className: "oembed oembed-video",
        href: null,
      },
      children: html2hast(options.postProcess(oEmbed.html)),
    }) as const,
  rich: (_, oEmbed, options) =>
    ({
      tagName: "div",
      properties: {
        className: "oembed oembed-rich",
        href: null,
      },
      children: html2hast(options.postProcess(oEmbed.html)),
    }) as const,
  link: (url) =>
    ({
      tagName: "a",
      properties: {
        href: url.href,
        className: "oembed oembed-link",
      },
      children: [{ type: "text", value: url.href }],
    }) as const,
}

/**
 * A transformer for oEmbed.
 * Embeds the content of the URL using the oEmbed metadata.
 * @see {@link https://oembed.com/ | oembed.com}
 *
 * @example
 * ```ts
 *  const html = (
 *   await unified()
 *     .use(remarkParse)
 *     .use(remarkRehype)
 *     .use(remarkEmbed, {
 *       transformers: [transformerOEmbed()],
 *     })
 *     .use(rehypeStringify)
 *     .process(md)
 * ).toString()
 * ```
 */
export const transformerOEmbed = (
  _options?: TransformerOEmbedOptions,
): Transformer => {
  const options = defu(_options, defaultTransformerOEmbedOptions)
  const cache = new Map<string, OEmbed | { type?: undefined }>()

  return {
    name: "oembed",
    tagName: (url) => {
      const oEmbed = cache.get(url.href)
      switch (oEmbed?.type) {
        case "photo":
          return options.photo(url, oEmbed, options).tagName
        case "video":
          return options.video(url, oEmbed, options).tagName
        case "rich":
          return options.rich(url, oEmbed, options).tagName
        case "link":
          return options.link(url, oEmbed, options).tagName
        default:
          return "div"
      }
    },
    properties: async (url) => {
      const oEmbed = cache.get(url.href)
      switch (oEmbed?.type) {
        case "photo":
          return options.photo(url, oEmbed, options).properties
        case "video":
          return options.video(url, oEmbed, options).properties
        case "rich":
          return options.rich(url, oEmbed, options).properties
        case "link":
          return options.link(url, oEmbed, options).properties
        default:
          return {}
      }
    },
    children: async (url) => {
      const oEmbed = cache.get(url.href)
      switch (oEmbed?.type) {
        case "photo":
          return options.photo(url, oEmbed, options).children
        case "video":
          return options.video(url, oEmbed, options).children
        case "rich":
          return options.rich(url, oEmbed, options).children
        case "link":
          return options.link(url, oEmbed, options).children
        default:
          return []
      }
    },
    match: async (url) => {
      const cached = cache.get(url.href)
      if (cached) return !!cached.type

      const provider = Object.values(options.providers).find((provider) =>
        provider.match(url),
      )
      if (provider) {
        try {
          const response = await provider.response(url)
          if (!response.ok) {
            cache.set(url.href, {})
            return false
          }
          const oEmbed = v.parse(OEmbedSchema, await response.json())
          cache.set(url.href, oEmbed)
          return true
        } catch (error) {
          cache.set(url.href, {})
          throw error
        }
      }

      const metadata = await unfurl(url.href)
      if (!metadata.oEmbed) {
        cache.set(url.href, {})
        return false
      }

      cache.set(url.href, metadata.oEmbed)
      return true
    },
  }
}

const html2hast = (html: string): ElementContent[] => {
  const hast = fromHtmlIsomorphic(html, {
    fragment: true,
  }).children
  return hast as ElementContent[]
}
