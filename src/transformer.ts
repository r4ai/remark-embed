import type { ElementContent, Properties } from "hast"

export type Transformer = {
  /**
   * The name of the transformer.
   *
   * @example "oembed"
   */
  name: string

  /**
   * The tag name of the element.
   *
   * @example "iframe", "img", "a"
   */
  tagName: string | ((url: URL) => string) | ((url: URL) => Promise<string>)

  /**
   * The properties of the element.
   *
   * @example { className: "oembed" }
   * @example (url) => ({ src: url.href, alt: "Image" })
   */
  properties:
    | ((url: URL) => Properties)
    | ((url: URL) => Promise<Properties>)
    | Properties

  /**
   * The children of the element.
   *
   * @example [{ type: "text", value: "Hello, World!" }]
   * @example (url) => [{ type: "text", value: url.href }]
   */
  children:
    | ElementContent[]
    | ((url: URL) => ElementContent[])
    | ((url: URL) => Promise<ElementContent[]>)

  /**
   * The URL matcher.
   * If the URL is matched, the transformer will be applied.
   *
   * @param url The URL to match.
   * @returns Whether the URL is matched.
   * @example (url) => url.hostname === "example.com"
   */
  match: ((url: URL) => boolean) | ((url: URL) => Promise<boolean>)
}
