import dedent from "dedent"
import { md2html } from "../../test/utils.js"

import { JSDOM } from "jsdom"
import { beforeAll, describe, expect, test } from "vitest"
import { transformerOEmbed } from "../index.js"

describe(transformerOEmbed.name, async () => {
  let jsdom: JSDOM
  let parser: DOMParser

  beforeAll(() => {
    jsdom = new JSDOM()
    parser = new jsdom.window.DOMParser()
  })

  test("YouTube video should be embedded with iframe", async () => {
    const md = dedent`
      <https://www.youtube.com/watch?v=jNQXAC9IVRw>
    `

    const { html } = await md2html(md, {
      transformers: [transformerOEmbed()],
    })
    const doc = parser.parseFromString(html, "text/html")
    const container = doc.querySelector(".oembed-video")
    const iframe = container?.querySelector("iframe")

    expect(container).not.toBeNull()
    expect(iframe).not.toBeNull()
    expect(iframe?.getAttribute("src")).toBe(
      "https://www.youtube.com/embed/jNQXAC9IVRw?feature=oembed",
    )
    expect(iframe?.getAttribute("width")).toBe("200")
    expect(iframe?.getAttribute("height")).toBe("150")
    expect(iframe?.getAttribute("title")).toBe("Me at the zoo")
  })

  test("Spotify playlist should be embedded with iframe", async () => {
    const md = dedent`
      <https://open.spotify.com/playlist/37i9dQZF1DXafb0IuPwJyF?si=9b42af02630c401a>
    `

    const { html } = await md2html(md, {
      transformers: [transformerOEmbed()],
    })
    const doc = parser.parseFromString(html, "text/html")
    const container = doc.querySelector(".oembed-rich")
    const iframe = container?.querySelector("iframe")

    expect(container).not.toBeNull()
    expect(iframe).not.toBeNull()
    expect(iframe?.getAttribute("src")).toBe(
      "https://open.spotify.com/embed/playlist/37i9dQZF1DXafb0IuPwJyF?utm_source=oembed",
    )
    expect(iframe?.getAttribute("width")).toBe("100%")
    expect(iframe?.getAttribute("height")).toBe("352")
    expect(iframe?.getAttribute("title")).toBe(
      "Spotify Embed: Tokyo Super Hits! ",
    )
  })

  test("Bluesky post should be embedded directly", async () => {
    const md = dedent`
      <https://bsky.app/profile/r4ai.dev/post/3k44wdxjqgo27>
    `

    const { html } = await md2html(md, {
      transformers: [transformerOEmbed()],
    })
    const doc = parser.parseFromString(html, "text/html")
    const container = doc.querySelector(".oembed-rich")

    expect(container).not.toBeNull()
    expect(container?.innerHTML).not.toBeNull()
  })

  test("Flickr photo should be embedded with img", async () => {
    const md = dedent`
      <https://www.flickr.com/photos/bees/2341623661/>
    `

    const { html } = await md2html(md, {
      transformers: [transformerOEmbed()],
    })
    const doc = parser.parseFromString(html, "text/html")
    const img = doc.querySelector(".oembed-photo")

    expect(img).not.toBeNull()
    expect(img?.getAttribute("src")).toBe(
      "https://live.staticflickr.com/3123/2341623661_7c99f48bbf_b.jpg",
    )
    expect(img?.getAttribute("width")).toBe("1024")
    expect(img?.getAttribute("height")).toBe("683")
    expect(img?.getAttribute("alt")).toBe("ZB8T0193")
  })
})
