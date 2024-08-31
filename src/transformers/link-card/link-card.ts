import { defu } from "defu"
import type { DeepReadonly, DeepRequired } from "ts-essentials"
import { unfurl } from "unfurl.js"
import type { Transformer } from "../../index.js"
import type { Element } from "../utils.js"
import { htmlPreset } from "./presets/html.js"

type Metadata = Awaited<ReturnType<typeof unfurl>>

export type LinkInfo = {
  url: string
  title: string
  description?: string
  favicon?: string
  image: {
    src?: string
    alt?: string
  }
}

export type TransformerLinkCardOptions = {
  tagName?:
    | ((info: DeepReadonly<LinkInfo>) => Element["tagName"])
    | ((info: DeepReadonly<LinkInfo>) => Promise<Element["tagName"]>)
  properties?:
    | ((info: DeepReadonly<LinkInfo>) => Element["properties"])
    | ((info: DeepReadonly<LinkInfo>) => Promise<Element["properties"]>)
  children?:
    | ((info: DeepReadonly<LinkInfo>) => Element["children"])
    | ((info: DeepReadonly<LinkInfo>) => Promise<Element["children"]>)
}

export const defaultTransformerLinkCardOptions =
  htmlPreset() satisfies DeepRequired<DeepReadonly<TransformerLinkCardOptions>>

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
  url: metadata.open_graph.url ?? url.href,
  title:
    metadata.open_graph.title ?? metadata.title ?? metadata.twitter_card.title,
  description:
    metadata.open_graph.description ??
    metadata.description ??
    metadata.twitter_card.description,
  favicon: metadata.favicon,
  image: {
    src:
      metadata.open_graph.images?.at(0)?.url ??
      metadata.twitter_card.images?.at(0)?.url,
    alt:
      metadata.open_graph.images?.at(0)?.alt ??
      metadata.twitter_card.images?.at(0)?.alt,
  },
})
