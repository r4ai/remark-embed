import { describe, expectTypeOf, test } from "vitest"
import type { DeepReadonly, DeepRequired } from "./utils.js"

describe("DeepRequired", () => {
  test("should not work with primitives", () => {
    type Input = {
      a?: boolean
      b?: number
      c?: string
      d?: undefined
      e?: null
      f?: symbol
      g?: bigint
      h?: true
      i?: 1
      j?: "string"
    }
    type Expected = {
      a: boolean
      b: number
      c: string
      d: never
      e: null
      f: symbol
      g: bigint
      h: true
      i: 1
      j: "string"
    }
    type Actual = DeepRequired<Input>
    expectTypeOf<Actual>().toEqualTypeOf<Expected>()
  })

  test("should work with nested objects", () => {
    type Input = {
      a?: {
        b?: {
          c?: number
        }
      }
      d?: {
        e?: string[]
      }
    }
    type Expected = {
      a: {
        b: {
          c: number
        }
      }
      d: {
        e: string[]
      }
    }
    type Actual = DeepRequired<Input>
    expectTypeOf<Actual>().toEqualTypeOf<Expected>()
  })

  test("should work with arrays and tuples", () => {
    type Input = {
      arr?: Array<{ a?: number }>
      tuple?: [boolean?, string?]
    }
    type Expected = {
      arr: Array<{ a: number }>
      tuple: [boolean, string]
    }
    type Actual = DeepRequired<Input>
    expectTypeOf<Actual>().toEqualTypeOf<Expected>()
  })

  test("should work with Map and Set", () => {
    type Input = {
      map?: Map<string, { a?: number }>
      set?: Set<{ b?: boolean }>
    }
    type Expected = {
      map: Map<string, { a: number }>
      set: Set<{ b: boolean }>
    }
    type Actual = DeepRequired<Input>
    expectTypeOf<Actual>().toEqualTypeOf<Expected>()
  })

  test("should work with functions", () => {
    type Input = {
      fn?: (param?: { a?: number }) => { b?: string }
    }
    type Expected = {
      fn: (param?: { a?: number }) => { b?: string }
    }
    type Actual = DeepRequired<Input>
    expectTypeOf<Actual>().toEqualTypeOf<Expected>()
  })

  test("should remove undefined from union types", () => {
    type Input = {
      value?: string | undefined
    }
    type Expected = {
      value: string
    }
    type Actual = DeepRequired<Input>
    expectTypeOf<Actual>().toEqualTypeOf<Expected>()
  })
})

describe("DeepReadonly", () => {
  test("should convert object properties to readonly", () => {
    type Input = {
      a: number
      b: string
    }
    type Expected = {
      readonly a: number
      readonly b: string
    }
    type Actual = DeepReadonly<Input>
    expectTypeOf<Actual>().toEqualTypeOf<Expected>()
  })

  test("should work with nested objects", () => {
    type Input = {
      a: {
        b: {
          c: number
        }
      }
    }
    type Expected = {
      readonly a: {
        readonly b: {
          readonly c: number
        }
      }
    }
    type Actual = DeepReadonly<Input>
    expectTypeOf<Actual>().toEqualTypeOf<Expected>()
  })

  test("should work with arrays and tuples", () => {
    type Input = {
      arr: Array<{ a: number }>
      tuple: [boolean, string]
    }
    type Expected = {
      readonly arr: readonly { readonly a: number }[]
      readonly tuple: readonly [boolean, string]
    }
    type Actual = DeepReadonly<Input>
    expectTypeOf<Actual>().toEqualTypeOf<Expected>()
  })

  test("should work with Map and Set", () => {
    type Input = {
      map: Map<string, { a: number }>
      set: Set<{ b: boolean }>
    }
    type Expected = {
      readonly map: ReadonlyMap<string, { readonly a: number }>
      readonly set: ReadonlySet<{ readonly b: boolean }>
    }
    type Actual = DeepReadonly<Input>
    expectTypeOf<Actual>().toEqualTypeOf<Expected>()
  })

  test("should work with functions", () => {
    type Input = {
      fn: (param: { a: number }) => { b: string }
    }
    type Expected = {
      readonly fn: (param: { a: number }) => { b: string }
    }
    type Actual = DeepReadonly<Input>
    expectTypeOf<Actual>().toEqualTypeOf<Expected>()
  })
})
