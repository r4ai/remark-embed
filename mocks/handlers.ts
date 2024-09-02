import * as fs from "node:fs/promises"
import path from "node:path"
import { http, HttpResponse, type RequestHandler } from "msw"

const generateWebHandlers = async (dir: string): Promise<RequestHandler[]> => {
  const dirs = await fs.readdir(dir, {
    recursive: true,
    withFileTypes: true,
  })
  const handlers = dirs
    .filter((dirent) => dirent.isFile())
    .map((file) => {
      const fullPath = path.join(file.parentPath, file.name)

      const urlWithoutScheme = fullPath.replace(
        new RegExp(`^${path.resolve(dir)}/`),
        "",
      )
      const urlDomain = urlWithoutScheme.split(path.sep)[0]
      const urlPath = urlWithoutScheme
        .split(path.sep)
        .slice(1)
        .join("/")
        .replace(/index\.html$/, "")
        .replace(/\.html$/, "")

      return http.get(new URL(urlPath, `https://${urlDomain}`).href, () =>
        fileContentResponse(file.name, fullPath),
      )
    })
  return handlers
}

const fileContentResponse = async (fileName: string, filePath: string) => {
  const extension = path.extname(fileName).replace(/^\./, "")
  switch (extension) {
    case "html": {
      const content = await fs.readFile(filePath, "utf-8")
      return HttpResponse.html(content)
    }
    case "json": {
      const content = await fs.readFile(filePath, "utf-8")
      return HttpResponse.json(JSON.parse(content))
    }
    case "xml": {
      const content = await fs.readFile(filePath, "utf-8")
      return HttpResponse.xml(content)
    }
    case "png":
    case "jpeg": {
      const content = await fs.readFile(filePath)
      return HttpResponse.arrayBuffer(content.buffer as ArrayBuffer, {
        headers: { "Content-Type": `image/${extension}` },
      })
    }
    default:
      throw new Error(`Unsupported file extension: ${extension} in ${filePath}`)
  }
}

export const handlers = await generateWebHandlers(
  path.resolve(import.meta.dirname, "web"),
)
