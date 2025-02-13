import { defu } from "defu"
import type { DeepReadonly, DeepRequired } from "../../utils.js"
import { h } from "../../utils.js"
import type { LinkInfo, TransformerLinkCardOptions } from "../link-card.js"

/**
 * The options for the HTML preset of the {@link transformerLinkCard}.
 */
export type HtmlPresetOptions = {
  /**
   * The prefix for the class names of the HTML elements.
   *
   * @default "link-card"
   */
  classNamePrefix?: string

  /**
   * Whether to open the link in a new tab.
   *
   * @default true
   */
  openInNewTab?: boolean

  /**
   * The alternative text for the favicon.
   *
   * @default `Favicon for ${new URL(info.url).hostname}`
   */
  faviconAlt?: (info: DeepReadonly<LinkInfo>) => string

  /**
   * The loading attribute for the images.
   *
   * @default "lazy"
   */
  imageLoading?: "lazy" | "eager" | "auto"

  /**
   * The decoding attribute for the images.
   *
   * @default "async"
   */
  imageDecoding?: "async" | "sync" | "auto"
}

/**
 * The default options for the HTML preset of the {@link transformerLinkCard}.
 */
export const defaultHtmlPresetOptions: Required<Readonly<HtmlPresetOptions>> = {
  classNamePrefix: "link-card",
  openInNewTab: true,
  faviconAlt: (info) => `Favicon for ${new URL(info.url).hostname}`,
  imageLoading: "lazy",
  imageDecoding: "async",
}

/**
 * The options preset to generate an HTML link card.
 *
 * @example
 * ```ts
 *  const html = (
 *   await unified()
 *     .use(remarkParse)
 *     .use(remarkRehype)
 *     .use(remarkEmbed, {
 *       transformers: [transformerOEmbed(htmlPreset())],
 *     })
 *     .use(rehypeStringify)
 *     .process("<https://r4ai.dev/posts/docker_tutorial/>")
 * ).toString()
 * ```
 * Yields:
 * ```html
 * <p>
 *   <a href="https://r4ai.dev/posts/docker_tutorial/" class="link-card" target="_blank" rel="noopener noreferrer">
 *       <div class="link-card__container">
 *           <div class="link-card__info">
 *               <div class="link-card__title">Docker 入門 | r4ai.dev</div>
 *               <div class="link-card__description">Tech blog by Rai</div>
 *               <div class="link-card__link">
 *                   <img class="link-card__favicon" src="https://r4ai.dev/favicon.svg" alt="Favicon for r4ai.dev" loading="lazy" decoding="async">
 *                   <span class="link-card__hostname">r4ai.dev</span>
 *               </div>
 *           </div>
 *           <div class="link-card__image">
 *             <img src="https://r4ai.dev/posts/docker_tutorial/ogimage.png" loading="lazy" decoding="async">
 *           </div>
 *       </div>
 *   </a>
 * </p>
 * ```
 */
export const htmlPreset = (
  _options?: Readonly<HtmlPresetOptions>,
): DeepRequired<DeepReadonly<TransformerLinkCardOptions>> => {
  const options = defu(_options, defaultHtmlPresetOptions)

  return {
    tagName: () => "a",
    properties: (info) => ({
      className: options.classNamePrefix,
      href: info.url,
      ...(options.openInNewTab && {
        target: "_blank",
        rel: "noopener noreferrer",
      }),
    }),
    children: (info) => [
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
    ],
  }
}
