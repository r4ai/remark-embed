import { screen } from "@testing-library/dom"
import dedent from "dedent"
import { describe, expect, test } from "vitest"
import { md2html, render } from "../../test/utils.js"
import { transformerOEmbed } from "../index.js"

describe(transformerOEmbed.name, async () => {
  test("Link should be embedded", async () => {
    const md = dedent`
      <https://oembed.example.com/link>
    `

    const { html } = await md2html(md, {
      transformers: [transformerOEmbed()],
    })
    render(html)

    const linkCard = screen.getByRole("link")
    expect(linkCard).toHaveAttribute("href", "https://oembed.example.com/link")
    expect(linkCard).toHaveTextContent("https://oembed.example.com/link")
    expect(linkCard).toHaveAttribute("class", "oembed oembed-link")
  })

  test("Photo should be embedded", async () => {
    const md = dedent`
      <https://oembed.example.com/photo>
    `

    const { html } = await md2html(md, {
      transformers: [transformerOEmbed()],
    })
    render(html)

    const photo = screen.getByRole("img")
    expect(photo).not.toHaveAttribute("href")
    expect(photo).toHaveAttribute("src")
    expect(photo).toHaveAttribute("width")
    expect(photo).toHaveAttribute("height")
    expect(photo).toHaveAttribute("class", "oembed oembed-photo")
  })

  test("Video should be embedded", async () => {
    const md = dedent`
      <https://oembed.example.com/video>
    `

    const { html } = await md2html(md, {
      transformers: [transformerOEmbed()],
    })
    render(html)

    const video = document.querySelector(".oembed-video")
    expect(video).not.toBeNull()
    expect(video).not.toHaveAttribute("href")
    expect(video).toHaveAttribute("class", "oembed oembed-video")
    expect(video?.querySelector("object")).not.toBeNull()
  })

  test("Rich should be embedded", async () => {
    const md = dedent`
      <https://oembed.example.com/rich>
    `

    const { html } = await md2html(md, {
      transformers: [transformerOEmbed()],
    })
    render(html)

    const rich = document.querySelector(".oembed-rich")
    expect(rich).not.toBeNull()
    expect(rich).not.toHaveAttribute("href")
    expect(rich).toHaveAttribute("class", "oembed oembed-rich")
    expect(rich?.querySelector("iframe")).not.toBeNull()
  })

  test("Website without oEmbed should not be embedded", async () => {
    const md = dedent`
      <https://www.example.com>
    `

    const { html } = await md2html(md, {
      transformers: [transformerOEmbed()],
    })
    render(html)

    const link = screen.getByRole("link")
    expect(link).toHaveAttribute("href", "https://www.example.com")
    expect(link).toHaveTextContent("https://www.example.com")
    expect(link.classList).not.toContain("oembed")
  })
})
