import dedent from "dedent"
import { md2html } from "../../test/utils.js"

import { JSDOM } from "jsdom"
import { beforeAll, describe, expect, test } from "vitest"
import { transformerLinkCard } from "../index.js"

describe(transformerLinkCard.name, () => {
  let jsdom: JSDOM
  let parser: DOMParser

  beforeAll(() => {
    jsdom = new JSDOM()
    parser = new jsdom.window.DOMParser()
  })

  test("YouTube video link card should be rendered", async () => {
    const md = dedent`
      <https://www.youtube.com/watch?v=jNQXAC9IVRw>
    `

    const { html } = await md2html(md, {
      transformers: [transformerLinkCard()],
    })

    const doc = parser.parseFromString(html, "text/html")

    const root = doc.querySelector(".link-card")
    expect(root).not.toBeNull()
    expect(root?.getAttribute("href")).toBe(
      "https://www.youtube.com/watch?v=jNQXAC9IVRw",
    )
    expect(root?.getAttribute("target")).toBe("_blank")
    expect(root?.getAttribute("rel")).toBe("noopener noreferrer")

    const container = doc?.querySelector(".link-card__container")
    expect(container).not.toBeNull()

    const info = doc?.querySelector(".link-card__info")
    expect(info).not.toBeNull()

    const title = doc?.querySelector(".link-card__title")
    expect(title).not.toBeNull()
    expect(title?.textContent).toBe("Me at the zoo")

    const description = doc?.querySelector(".link-card__description")
    expect(description).not.toBeNull()
    expect(description?.textContent).toBe(
      "10mph vs mach 10 Airplane Fly-byhttps://www.youtube.com/watch?v=oPD-JIq0FQ800:00 Intro00:05 The cool thing00:17 End",
    )

    const link = doc?.querySelector(".link-card__link")
    expect(link).not.toBeNull()

    const favicon = link?.querySelector(".link-card__favicon")
    expect(favicon).not.toBeNull()
    expect(favicon?.getAttribute("src")).not.toBeNull()
    expect(favicon?.getAttribute("alt")).toBe("Favicon for www.youtube.com")

    const hostname = link?.querySelector(".link-card__hostname")
    expect(hostname).not.toBeNull()
    expect(hostname?.textContent).toBe("www.youtube.com")

    const image = doc?.querySelector(".link-card__image img")
    expect(image).not.toBeNull()
    expect(image?.getAttribute("src")).not.toBeNull()
    expect(image?.getAttribute("alt")).toBeNull()
    expect(image?.getAttribute("loading")).toBe("lazy")
    expect(image?.getAttribute("decoding")).toBe("async")
  })

  test("Zenn.dev article link card should be rendered", async () => {
    const md = dedent`
      <https://zenn.dev/ricora/articles/5a170c17933c3f>
    `

    const { html } = await md2html(md, {
      transformers: [transformerLinkCard()],
    })

    const doc = parser.parseFromString(html, "text/html")

    const root = doc.querySelector(".link-card")
    expect(root).not.toBeNull()
    expect(root?.getAttribute("href")).toBe(
      "https://zenn.dev/ricora/articles/5a170c17933c3f",
    )
    expect(root?.getAttribute("target")).toBe("_blank")
    expect(root?.getAttribute("rel")).toBe("noopener noreferrer")

    const container = doc?.querySelector(".link-card__container")
    expect(container).not.toBeNull()

    const info = doc?.querySelector(".link-card__info")
    expect(info).not.toBeNull()

    const title = doc?.querySelector(".link-card__title")
    expect(title).not.toBeNull()
    expect(title?.textContent).toBe(
      "大学のプログラミングサークルのWebサイトをAstro×SolidJSで制作したので技術スタックを紹介",
    )

    const description = doc?.querySelector(".link-card__description")
    expect(description).toBeNull()

    const link = doc?.querySelector(".link-card__link")
    expect(link).not.toBeNull()

    const favicon = link?.querySelector(".link-card__favicon")
    expect(favicon).not.toBeNull()
    expect(favicon?.getAttribute("src")).not.toBeNull()
    expect(favicon?.getAttribute("alt")).toBe("Favicon for zenn.dev")

    const hostname = link?.querySelector(".link-card__hostname")
    expect(hostname).not.toBeNull()
    expect(hostname?.textContent).toBe("zenn.dev")

    const image = doc?.querySelector(".link-card__image img")
    expect(image).not.toBeNull()
    expect(image?.getAttribute("src")).not.toBeNull()
    expect(image?.getAttribute("alt")).toBeNull()
    expect(image?.getAttribute("loading")).toBe("lazy")
    expect(image?.getAttribute("decoding")).toBe("async")
  })
})
