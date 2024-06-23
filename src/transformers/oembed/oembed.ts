import { defu } from "defu"
import type { ElementContent, Properties } from "hast"
import { fromHtmlIsomorphic } from "hast-util-from-html-isomorphic"
import { unfurl } from "unfurl.js"
import type { Metadata } from "unfurl.js/dist/types"
import type { Transformer } from "../.."

export type Element = {
  /**
   * The tag name of the element.
   * @example "iframe", "img", "a"
   */
  tagName: string

  /**
   * The properties of the element.
   * @example { className: "oembed" }
   * @example { src: "https://example.com/image.jpg", alt: "Image" }
   */
  properties: Properties

  /**
   * The children of the element.
   * @example []
   * @example [{ type: "text", value: "Hello, World!" }]
   */
  children: ElementContent[]
}

export type OEmbedPhoto = Metadata["oEmbed"] & { type: "photo" }

export type OEmbedVideo = Metadata["oEmbed"] & { type: "video" }

export type OEmbedRich = Metadata["oEmbed"] & { type: "rich" }

export type OEmbedLink = Metadata["oEmbed"] & { type: "link" }

export type TransformerOEmbedOptions = {
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
    oEmbed: OEmbedPhoto,
    options: Required<TransformerOEmbedOptions>,
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
    oEmbed: OEmbedVideo,
    options: Required<TransformerOEmbedOptions>,
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
    oEmbed: OEmbedRich,
    options: Required<TransformerOEmbedOptions>,
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
    oEmbed: OEmbedLink,
    options: Required<TransformerOEmbedOptions>,
  ) => Element
}

export const defaultTransformerOEmbedOptions: Required<
  Readonly<TransformerOEmbedOptions>
> = {
  postProcess: (html) => html,
  photo: (_, oEmbed) => ({
    tagName: "img",
    properties: {
      src: oEmbed.url,
      width: oEmbed.width,
      height: oEmbed.height,
      alt: oEmbed.title,
      className: "oembed-photo",
      href: null,
    },
    children: [],
  }),
  video: (_, oEmbed, options) => ({
    tagName: "div",
    properties: {
      className: "oembed-video",
      href: null,
    },
    children: html2hast(options.postProcess(oEmbed.html)),
  }),
  rich: (_, oEmbed, options) => ({
    tagName: "div",
    properties: {
      className: "oembed-rich",
      href: null,
    },
    children: html2hast(options.postProcess(oEmbed.html)),
  }),
  link: (url) => ({
    tagName: "a",
    properties: {
      href: url.href,
      className: "oembed-link",
    },
    children: [{ type: "text", value: url.href }],
  }),
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
  const cache = new Map<string, Metadata>()

  return {
    name: "oembed",
    tagName: (url) => {
      const metadata = cache.get(url.href)
      switch (metadata?.oEmbed?.type) {
        case "photo":
          return options.photo(url, metadata.oEmbed, options).tagName
        case "video":
          return options.video(url, metadata.oEmbed, options).tagName
        case "rich":
          return options.rich(url, metadata.oEmbed, options).tagName
        case "link":
          return options.link(url, metadata.oEmbed, options).tagName
        default:
          return "div"
      }
    },
    properties: async (url) => {
      const metadata = cache.get(url.href)
      switch (metadata?.oEmbed?.type) {
        case "photo":
          return options.photo(url, metadata.oEmbed, options).properties
        case "video":
          return options.video(url, metadata.oEmbed, options).properties
        case "rich":
          return options.rich(url, metadata.oEmbed, options).properties
        case "link":
          return options.link(url, metadata.oEmbed, options).properties
        default:
          return {}
      }
    },
    children: async (url) => {
      const metadata = cache.get(url.href)
      switch (metadata?.oEmbed?.type) {
        case "photo":
          return options.photo(url, metadata.oEmbed, options).children
        case "video":
          return options.video(url, metadata.oEmbed, options).children
        case "rich":
          return options.rich(url, metadata.oEmbed, options).children
        case "link":
          return options.link(url, metadata.oEmbed, options).children
        default:
          return []
      }
    },
    match: async (url) => {
      const metadata = cache.get(url.href) ?? (await unfurl(url.href))
      if (metadata.oEmbed == null) return false

      cache.set(url.href, metadata)
      return true
    },
  }
}

const html2hast = (html: string) => {
  const hast = fromHtmlIsomorphic(html, {
    fragment: true,
  }).children
  return hast as ElementContent[]
}
