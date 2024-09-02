import dedent from "dedent"
import { md2html, render } from "../../test/utils.js"

import { describe, expect, test } from "vitest"
import { transformerLinkCard } from "../index.js"

describe(transformerLinkCard.name, () => {
  test("Link card should be rendered when Open Graph metadata is available", async () => {
    const md = dedent`
      <https://open-graph.example.com>
    `

    const { html } = await md2html(md, {
      transformers: [transformerLinkCard()],
    })
    render(html)

    const root = document.querySelector(".link-card")
    expect(root).not.toBeNull()
    expect(root).toHaveAttribute("href", "https://open-graph.example.com/")
    expect(root).toHaveAttribute("target", "_blank")
    expect(root).toHaveAttribute("rel", "noopener noreferrer")

    const container = document?.querySelector(".link-card__container")
    expect(container).not.toBeNull()

    const info = document?.querySelector(".link-card__info")
    expect(info).not.toBeNull()

    const title = document?.querySelector(".link-card__title")
    expect(title).not.toBeNull()
    expect(title).toHaveTextContent("Open Graph")

    const description = document?.querySelector(".link-card__description")
    expect(description).not.toBeNull()
    expect(description).toHaveTextContent("An example of Open Graph")

    const link = document?.querySelector(".link-card__link")
    expect(link).not.toBeNull()

    const favicon = link?.querySelector(".link-card__favicon")
    expect(favicon).not.toBeNull()
    expect(favicon).toHaveAttribute("src")
    expect(favicon).toHaveAttribute("alt", "Favicon for open-graph.example.com")
    expect(favicon).toHaveAttribute("loading", "lazy")
    expect(favicon).toHaveAttribute("decoding", "async")

    const hostname = link?.querySelector(".link-card__hostname")
    expect(hostname).not.toBeNull()
    expect(hostname).toHaveTextContent("open-graph.example.com")

    const image = document?.querySelector(".link-card__image img")
    expect(image).not.toBeNull()
    expect(image).toHaveAttribute("src")
    expect(image).toHaveAttribute("loading", "lazy")
    expect(image).toHaveAttribute("decoding", "async")
  })

  test("Link card should be rendered when Twitter Card metadata is available", async () => {
    const md = dedent`
      <https://twitter-card.example.com>
    `

    const { html } = await md2html(md, {
      transformers: [transformerLinkCard()],
    })
    render(html)

    const root = document.querySelector(".link-card")
    expect(root).not.toBeNull()
    expect(root).toHaveAttribute("href", "https://twitter-card.example.com/")
    expect(root).toHaveAttribute("target", "_blank")
    expect(root).toHaveAttribute("rel", "noopener noreferrer")

    const container = document?.querySelector(".link-card__container")
    expect(container).not.toBeNull()

    const info = document?.querySelector(".link-card__info")
    expect(info).not.toBeNull()

    const title = document?.querySelector(".link-card__title")
    expect(title).not.toBeNull()
    expect(title).toHaveTextContent("Twitter Card")

    const description = document?.querySelector(".link-card__description")
    expect(description).not.toBeNull()
    expect(description).toHaveTextContent("Sample Twitter Card")

    const link = document?.querySelector(".link-card__link")
    expect(link).not.toBeNull()

    const favicon = link?.querySelector(".link-card__favicon")
    expect(favicon).not.toBeNull()
    expect(favicon).toHaveAttribute("src")
    expect(favicon).toHaveAttribute(
      "alt",
      "Favicon for twitter-card.example.com",
    )
    expect(favicon).toHaveAttribute("loading", "lazy")
    expect(favicon).toHaveAttribute("decoding", "async")

    const hostname = link?.querySelector(".link-card__hostname")
    expect(hostname).not.toBeNull()
    expect(hostname).toHaveTextContent("twitter-card.example.com")
  })

  test("Link card should be rendered when Open Graph and Twitter Card metadata are available", async () => {
    const md = dedent`
      <https://open-graph.example.com/with-twitter-card>
    `

    const { html } = await md2html(md, {
      transformers: [transformerLinkCard()],
    })
    render(html)

    const root = document.querySelector(".link-card")
    expect(root).not.toBeNull()
    expect(root).toHaveAttribute("href", "https://open-graph.example.com/")
    expect(root).toHaveAttribute("target", "_blank")
    expect(root).toHaveAttribute("rel", "noopener noreferrer")

    const container = document?.querySelector(".link-card__container")
    expect(container).not.toBeNull()

    const info = document?.querySelector(".link-card__info")
    expect(info).not.toBeNull()

    const title = document?.querySelector(".link-card__title")
    expect(title).not.toBeNull()
    expect(title).toHaveTextContent("Open Graph and Twitter Card")

    const description = document?.querySelector(".link-card__description")
    expect(description).not.toBeNull()
    expect(description).toHaveTextContent(
      "An example of Open Graph with Twitter Card",
    )

    const link = document?.querySelector(".link-card__link")
    expect(link).not.toBeNull()

    const favicon = link?.querySelector(".link-card__favicon")
    expect(favicon).not.toBeNull()
    expect(favicon).toHaveAttribute("src")
    expect(favicon).toHaveAttribute("alt", "Favicon for open-graph.example.com")
    expect(favicon).toHaveAttribute("loading", "lazy")
    expect(favicon).toHaveAttribute("decoding", "async")

    const hostname = link?.querySelector(".link-card__hostname")
    expect(hostname).not.toBeNull()
    expect(hostname).toHaveTextContent("open-graph.example.com")

    const image = document?.querySelector(".link-card__image img")
    expect(image).not.toBeNull()
    expect(image).toHaveAttribute("src")
    expect(image).toHaveAttribute("loading", "lazy")
    expect(image).toHaveAttribute("decoding", "async")
  })

  test("link card should be rendered when Open Graph and Twitter Card metadata are unavailable", async () => {
    const md = dedent`
      <https://www.example.com>
    `

    const { html } = await md2html(md, {
      transformers: [transformerLinkCard()],
    })
    render(html)

    const root = document.querySelector(".link-card")
    expect(root).not.toBeNull()
    expect(root).toHaveAttribute("href", "https://www.example.com/")
    expect(root).toHaveAttribute("target", "_blank")
    expect(root).toHaveAttribute("rel", "noopener noreferrer")

    const container = document?.querySelector(".link-card__container")
    expect(container).not.toBeNull()

    const info = document?.querySelector(".link-card__info")
    expect(info).not.toBeNull()

    const title = document?.querySelector(".link-card__title")
    expect(title).not.toBeNull()
    expect(title).toHaveTextContent("Example Domain")

    const description = document?.querySelector(".link-card__description")
    expect(description).toBeNull()

    const link = document?.querySelector(".link-card__link")
    expect(link).not.toBeNull()

    const favicon = link?.querySelector(".link-card__favicon")
    expect(favicon).not.toBeNull()
    expect(favicon).toHaveAttribute("src")
    expect(favicon).toHaveAttribute("alt", "Favicon for www.example.com")
    expect(favicon).toHaveAttribute("loading", "lazy")
    expect(favicon).toHaveAttribute("decoding", "async")

    const hostname = link?.querySelector(".link-card__hostname")
    expect(hostname).not.toBeNull()
    expect(hostname).toHaveTextContent("www.example.com")

    const image = document?.querySelector(".link-card__image img")
    expect(image).toBeNull()
  })
})
