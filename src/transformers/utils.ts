import type { ElementContent, Properties } from "hast"
import type { DeepReadonly } from "ts-essentials"

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

/**
 * Utility to create hast elements.
 */
export const h = <Children extends Child[]>(
  tagName: string,
  properties: Properties,
  ...children: Children
) =>
  ({
    type: "element",
    tagName,
    properties,
    children: children
      .filter((child) => child != null)
      .map((child) =>
        typeof child === "string"
          ? ({ type: "text", value: child } as const satisfies TextElement)
          : child,
      ) as MapChildren<FilterChildren<Children>>,
  }) as const satisfies ElementContent

type Child = ElementContent | string | null | undefined | false

type TextElement<Value extends string = string> = { type: "text"; value: Value }

type MapChildren<Children extends (ElementContent | string)[]> = {
  [K in keyof Children]: Children[K] extends string
    ? DeepReadonly<TextElement<Children[K]>>
    : Children[K]
}

type FilterChildren<Children extends Child[]> = Children extends [
  infer First extends Child,
  ...infer Rest extends Child[],
]
  ? First extends null | undefined | false
    ? FilterChildren<Rest>
    : [First, ...FilterChildren<Rest>]
  : []
