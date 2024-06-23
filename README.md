# @r4ai/remark-embed

[![JSR](https://jsr.io/badges/@r4ai/remark-embed)](https://jsr.io/@r4ai/remark-embed)
[![codecov](https://codecov.io/gh/r4ai/remark-embed/graph/badge.svg?token=B9EZXC0PR8)](https://codecov.io/gh/r4ai/remark-embed)
[![CI](https://github.com/r4ai/remark-embed/actions/workflows/ci.yml/badge.svg)](https://github.com/r4ai/remark-embed/actions/workflows/ci.yml)
[![Version or Publish](https://github.com/r4ai/remark-embed/actions/workflows/changeset-version.yml/badge.svg)](https://github.com/r4ai/remark-embed/actions/workflows/changeset-version.yml)
[![CodeQL](https://github.com/r4ai/remark-embed/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/r4ai/remark-embed/actions/workflows/github-code-scanning/codeql)

A remark plugin to embed the content of the URL.

## Features

- [oEmbed](https://en.wikipedia.org/wiki/OEmbed) support with [transformerOEmbed](https://jsr.io/@r4ai/remark-embed/doc/transformers/~/transformerOEmbed)
  - YouTube
  - Spotify
  - SpeakerDeck
  - ...
- Fully customizable with [transformers](https://jsr.io/@r4ai/remark-embed/doc/~/RemarkEmbedOptions.transformers)
  - You can define your own [transformer](https://jsr.io/@r4ai/remark-embed/doc/~/Transformer)

## Usage

```ts
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import remarkEmbed from "./src/index.ts";
import { transformerOEmbed } from "./src/transformers";
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
  <div class="oembed-video">
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
