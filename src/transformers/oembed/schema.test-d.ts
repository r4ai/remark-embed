import type * as v from "valibot"
import { describe, expectTypeOf, test } from "vitest"
import type {
  OEmbed,
  OEmbedBase,
  OEmbedBaseSchema,
  OEmbedLink,
  OEmbedLinkSchema,
  OEmbedPhoto,
  OEmbedPhotoSchema,
  OEmbedRich,
  OEmbedRichSchema,
  OEmbedSchema,
  OEmbedVideo,
  OEmbedVideoSchema,
} from "./schemas.js"

describe("OEmbed schema types", () => {
  test("OEmbed base schema type", () => {
    type OEmbedBaseSchemaOutput = v.InferOutput<typeof OEmbedBaseSchema>
    expectTypeOf<OEmbedBaseSchemaOutput>().toEqualTypeOf<OEmbedBase>()
  })

  test("OEmbed photo schema type", () => {
    type OEmbedPhotoSchemaOutput = v.InferOutput<typeof OEmbedPhotoSchema>

    // Without `.branded`, following expectation will fail.
    // See: https://github.com/vitest-dev/vitest/issues/4114#issuecomment-2265570767
    expectTypeOf<OEmbedPhotoSchemaOutput>().branded.toEqualTypeOf<OEmbedPhoto>()
  })

  test("OEmbed video schema type", () => {
    type OEmbedVideoSchemaOutput = v.InferOutput<typeof OEmbedVideoSchema>
    expectTypeOf<OEmbedVideoSchemaOutput>().branded.toEqualTypeOf<OEmbedVideo>()
  })

  test("OEmbed link schema type", () => {
    type OEmbedLinkSchemaOutput = v.InferOutput<typeof OEmbedLinkSchema>
    expectTypeOf<OEmbedLinkSchemaOutput>().branded.toEqualTypeOf<OEmbedLink>()
  })

  test("OEmbed rich schema type", () => {
    type OEmbedRichSchemaOutput = v.InferOutput<typeof OEmbedRichSchema>
    expectTypeOf<OEmbedRichSchemaOutput>().branded.toEqualTypeOf<OEmbedRich>()
  })

  test("OEmbed schemas type", () => {
    type OEmbedSchemaOutput = v.InferOutput<typeof OEmbedSchema>
    expectTypeOf<OEmbedSchemaOutput>().branded.toEqualTypeOf<OEmbed>()
  })
})
