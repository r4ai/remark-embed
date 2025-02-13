import * as v from "valibot"

export type OEmbedBase = {
  version: string
  title?: string | undefined
  author_name?: string | undefined
  author_url?: string | undefined
  provider_name?: string | undefined
  provider_url?: string | undefined
  cache_age?: number | undefined
  thumbnails?: [{ url?: string; width?: number; height?: number }] | undefined
}

export const OEmbedBaseSchema = v.object({
  version: v.string(),
  title: v.optional(v.string()),
  author_name: v.optional(v.string()),
  author_url: v.optional(v.string()),
  provider_name: v.optional(v.string()),
  provider_url: v.optional(v.string()),
  cache_age: v.optional(
    v.union([v.number(), v.pipe(v.string(), v.transform(Number.parseInt))]),
  ),
  thumbnails: v.optional(
    v.tuple([
      v.object({
        url: v.optional(v.string()),
        width: v.optional(v.number()),
        height: v.optional(v.number()),
      }),
    ]),
  ),
})

export const OEmbedPhotoSchema = v.object({
  ...OEmbedBaseSchema.entries,
  type: v.literal("photo"),
  url: v.string(),
  width: v.number(),
  height: v.number(),
})

export type OEmbedPhoto = OEmbedBase & {
  type: "photo"
  url: string
  width: number
  height: number
}

export const OEmbedVideoSchema = v.object({
  ...OEmbedBaseSchema.entries,
  type: v.literal("video"),
  html: v.string(),
  width: v.number(),
  height: v.number(),
})

export type OEmbedVideo = OEmbedBase & {
  type: "video"
  html: string
  width: number
  height: number
}

export const OEmbedLinkSchema = v.object({
  ...OEmbedBaseSchema.entries,
  type: v.literal("link"),
})

export type OEmbedLink = OEmbedBase & {
  type: "link"
}

export const OEmbedRichSchema = v.object({
  ...OEmbedBaseSchema.entries,
  type: v.literal("rich"),
  html: v.string(),
  // `width` and `height` are required in OEmbed specification.
  // However, Twitter OEmbed API returns `null`.
  // https://developer.x.com/en/docs/x-for-websites/oembed-api
  width: v.nullable(v.number()),
  height: v.nullable(v.number()),
})

export type OEmbedRich = OEmbedBase & {
  type: "rich"
  html: string
  width: number | null
  height: number | null
}

export const OEmbedSchema = v.union([
  OEmbedPhotoSchema,
  OEmbedVideoSchema,
  OEmbedLinkSchema,
  OEmbedRichSchema,
])

export type OEmbed = OEmbedPhoto | OEmbedVideo | OEmbedLink | OEmbedRich
