import * as v from "valibot"

const OEmbedBaseSchema = v.object({
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

const OEmbedPhotoSchema = v.object({
  ...OEmbedBaseSchema.entries,
  type: v.literal("photo"),
  url: v.string(),
  width: v.number(),
  height: v.number(),
})

export type OEmbedPhoto = v.InferOutput<typeof OEmbedPhotoSchema>

const OEmbedVideoSchema = v.object({
  ...OEmbedBaseSchema.entries,
  type: v.literal("video"),
  html: v.string(),
  width: v.number(),
  height: v.number(),
})

export type OEmbedVideo = v.InferOutput<typeof OEmbedVideoSchema>

const OEmbedLinkSchema = v.object({
  ...OEmbedBaseSchema.entries,
  type: v.literal("link"),
})

export type OEmbedLink = v.InferOutput<typeof OEmbedLinkSchema>

const OEmbedRichSchema = v.object({
  ...OEmbedBaseSchema.entries,
  type: v.literal("rich"),
  html: v.string(),
  // `width` and `height` are required in OEmbed specification.
  // However, Twitter OEmbed API returns `null`.
  // https://developer.x.com/en/docs/x-for-websites/oembed-api
  width: v.nullable(v.number()),
  height: v.nullable(v.number()),
})

export type OEmbedRich = v.InferOutput<typeof OEmbedRichSchema>

export const OEmbedSchema = v.union([
  OEmbedPhotoSchema,
  OEmbedVideoSchema,
  OEmbedLinkSchema,
  OEmbedRichSchema,
])

export type OEmbed = v.InferOutput<typeof OEmbedSchema>
