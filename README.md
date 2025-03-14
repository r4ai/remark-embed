# @r4ai/remark-embed

[![JSR](https://jsr.io/badges/@r4ai/remark-embed)](https://jsr.io/@r4ai/remark-embed)
[![codecov](https://codecov.io/gh/r4ai/remark-embed/graph/badge.svg?token=B9EZXC0PR8)](https://codecov.io/gh/r4ai/remark-embed)
[![CI](https://github.com/r4ai/remark-embed/actions/workflows/ci.yml/badge.svg)](https://github.com/r4ai/remark-embed/actions/workflows/ci.yml)
[![Version or Publish](https://github.com/r4ai/remark-embed/actions/workflows/changeset-version.yml/badge.svg)](https://github.com/r4ai/remark-embed/actions/workflows/changeset-version.yml)
[![CodeQL](https://github.com/r4ai/remark-embed/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/r4ai/remark-embed/actions/workflows/github-code-scanning/codeql)

A remark plugin to embed the content of the URL.

## Features

- Embed website using [oEmbed](https://en.wikipedia.org/wiki/OEmbed) by [`transformerOEmbed`](https://jsr.io/@r4ai/remark-embed/doc/transformers/~/transformerOEmbed)
  - YouTube
  - Spotify
  - SpeakerDeck
  - ...
- Generate link card using [Open Graph](https://ogp.me/) metadata by [`transformerLinkCard`](https://jsr.io/@r4ai/remark-embed/doc/transformers/~/transformerLinkCard)
  - Twitter
  - Facebook
  - ...
- Fully customizable with [transformers](https://jsr.io/@r4ai/remark-embed/doc/~/RemarkEmbedOptions.transformers)
  - You can define your own [transformer](https://jsr.io/@r4ai/remark-embed/doc/~/Transformer)

### About this plugin

This plugin rewrite a paragraph containing only a URL, such as the following, into any element through the [transformer](https://jsr.io/@r4ai/remark-embed/doc/~/Transformer).

```md
https://example.com/hoge
```

> [!note]
> Note that URLs such as the following will not be converted:
>
> - `according to https://example.com/hoge`
> - `[example](https://example.com/hoge)`
>
> URL must be the only content in the paragraph.
>
> Also, if there is no blank line before and after the paragraph, it will not be converted.

### Transformer

Currently, this plugin provides the following transformers:

- [`transformerOEmbed`](https://jsr.io/@r4ai/remark-embed/doc/transformers/~/transformerOEmbed) - embeds the URL content by fetching the oEmbed metadata
- [`transformerLinkCard`](https://jsr.io/@r4ai/remark-embed/doc/transformers/~/transformerLinkCard) - generates a link card by fetching the Open Graph metadata

You can also define your own [transformer](https://jsr.io/@r4ai/remark-embed/doc/~/Transformer). Please refer to the transformer in the [./src/transformers](./src/transformers) directory for details on how to define them.

Following is the algorithm of how this plugin will apply the transformers.

1. let `elements` be a list of link nodes such that each node's parent paragraph contains only one link\
   Example: `elements = [{ type: 'link', url: 'https://example.com/hoge' }]`
2. for each `element` of `elements`, do the following in parallel:
   1. let `url` be the `element`'s url value.
   2. for each `transformer` of `transformers`, do the following in sequence:
      1. if `transformer.match(url)` is `true`:
         1. replace the `element`'s tag name with the result of `transformer.tagName(url)`
         2. replace the `element`'s properties with the result of `transformer.properties(url)`
         3. replace the `element`'s children with the result of `transformer.children(url)`

## Installation

- **Bun**:

  ```sh
  bun add @r4ai/remark-embed
  ```

- **Deno**:

  ```sh
  deno add @r4ai/remark-embed
  ```

- **NPM**:

  ```sh
  npm install @r4ai/remark-embed
  ```

- **PNPM**:

  ```sh
  pnpm add @r4ai/remark-embed
  ```

- **Yarn**:

  ```sh
  yarn add @r4ai/remark-embed
  ```

## Usage

```ts
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import remarkEmbed from "@r4ai/remark-embed";
import { transformerOEmbed } from "@r4ai/remark-embed/transformers";

const md = `
<https://www.youtube.com/watch?v=jNQXAC9IVRw>
`;

const html = (
  await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(remarkEmbed, {
      transformers: [transformerOEmbed()],
    })
    .use(rehypeStringify)
    .process(md)
).toString();

console.log(html);
```

Yields:

```html
<p>
  <div class="oembed oembed-video">
    <iframe
      width="200"
      height="150"
      src="https://www.youtube.com/embed/jNQXAC9IVRw?feature=oembed"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
      title="Me at the zoo">
    </iframe>
  </div>
</p>
```

## Documentation

See: <https://jsr.io/@r4ai/remark-embed/doc>
