import "@testing-library/jest-dom/vitest"
import { setupServer } from "msw/node"
import { afterAll, beforeAll, beforeEach } from "vitest"
import { handlers } from "./mocks/handlers.js"

const server = setupServer(...handlers)

beforeAll(() => server.listen({ onUnhandledRequest: "error" }))
afterAll(() => server.close())
beforeEach(() => server.resetHandlers())
