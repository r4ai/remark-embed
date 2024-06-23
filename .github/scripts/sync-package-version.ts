import * as fs from "node:fs/promises"

// Read the package.json file and get the version
const packageJson = JSON.parse(await fs.readFile("package.json", "utf-8"))
const packageJsonVersion = packageJson.version

// Read the jsr.json file and replace the version with the package.json version
let jsrJson = await fs.readFile("jsr.json", "utf-8")
jsrJson = jsrJson.replace(
  /"version"\s*:\s*"\d+\.\d+\.\d+"/,
  `"version": "${packageJsonVersion}"`,
)
await fs.writeFile("jsr.json", jsrJson)
