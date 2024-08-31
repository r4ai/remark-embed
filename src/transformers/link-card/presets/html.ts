import { defu } from "defu"
import type { DeepReadonly, DeepRequired } from "ts-essentials"
import { h } from "../../utils.js"
import type { LinkInfo, TransformerLinkCardOptions } from "../link-card.js"

export type HtmlPresetOptions = {
  classNamePrefix?: string
  openInNewTab?: boolean
  faviconAlt?: (info: DeepReadonly<LinkInfo>) => string
  imageLoading?: "lazy" | "eager" | "auto"
  imageDecoding?: "async" | "sync" | "auto"
}

export const defaultHtmlPresetOptions: Required<Readonly<HtmlPresetOptions>> = {
  classNamePrefix: "link-card",
  openInNewTab: true,
  faviconAlt: (info) => `Favicon for ${new URL(info.url).hostname}`,
  imageLoading: "lazy",
  imageDecoding: "async",
}

export const htmlPreset = (_options?: Readonly<HtmlPresetOptions>) => {
  const options = defu(_options, defaultHtmlPresetOptions)

  return {
    tagName: () => "a",
    properties: (info) =>
      ({
        className: options.classNamePrefix,
        href: info.url,
        ...(options.openInNewTab && {
          target: "_blank",
          rel: "noopener noreferrer",
        }),
      }) as const,
    children: (info) =>
      [
        h(
          "div",
          { className: `${options.classNamePrefix}__container` },
          h(
            "div",
            { className: `${options.classNamePrefix}__info` },
            h(
              "div",
              { className: `${options.classNamePrefix}__title` },
              info.title,
            ),
            info.description &&
              h(
                "div",
                { className: `${options.classNamePrefix}__description` },
                info.description,
              ),
            h(
              "div",
              { className: `${options.classNamePrefix}__link` },
              h("img", {
                className: `${options.classNamePrefix}__favicon`,
                src: info.favicon,
                alt: options.faviconAlt(info),
                loading: options.imageLoading,
                decoding: options.imageDecoding,
              }),
              h(
                "span",
                { className: `${options.classNamePrefix}__hostname` },
                new URL(info.url).hostname,
              ),
            ),
          ),
          info.image.src &&
            h(
              "div",
              { className: `${options.classNamePrefix}__image` },
              h("img", {
                src: info.image.src,
                alt: info.image.alt,
                loading: options.imageLoading,
                decoding: options.imageDecoding,
              }),
            ),
        ),
      ] as const,
  } as const satisfies DeepRequired<DeepReadonly<TransformerLinkCardOptions>>
}
