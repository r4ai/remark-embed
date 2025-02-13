import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    testTimeout: 15 * 1000,
    typecheck: {
      enabled: true,
    },
    environment: "happy-dom",
    setupFiles: ["./vitest.setup.ts"],
  },
})
