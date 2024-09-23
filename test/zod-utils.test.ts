import * as z from 'zod'
import { zodDeepPartial, parseFieldsAsArrays } from '../src/zod-utils'

describe('zodDeepPartial', () => {
  test('partial of primitives', () => {
    const deepPartial = zodDeepPartial(
      z.object({
        s: z.string(),
        n: z.number(),
        i: z.bigint(),
        b: z.boolean(),
        z: z.null(),
        u: z.undefined(),
      })
    )

    const correctValues = {
      s: 'string',
      n: 10,
      i: BigInt(2),
      b: true,
      z: null,
      u: undefined,
    }

    expect(deepPartial.parse({})).toEqual({})
    expect(deepPartial.parse({ z: null })).toEqual({ z: null })
    expect(deepPartial.parse({ u: undefined })).toEqual({ u: undefined })
    expect(deepPartial.parse(correctValues)).toEqual(correctValues)
    expect(() => deepPartial.parse({ s: 10 })).toThrow()
    expect(() => deepPartial.parse({ n: 'a' })).toThrow()
    expect(() => deepPartial.parse({ i: 'a' })).toThrow()
    expect(() => deepPartial.parse({ b: 'a' })).toThrow()
  })

  test('partial of unions', () => {
    const deepPartial = zodDeepPartial(
      z.union([
        z.object({ s: z.string() }).strict(),
        z.object({ n: z.number() }).strict(),
      ])
    )

    expect(deepPartial.parse({ s: 'string' })).toEqual({ s: 'string' })
    expect(deepPartial.parse({ n: 10 })).toEqual({ n: 10 })
    expect(deepPartial.parse({})).toEqual({})

    expect(() => deepPartial.parse({ n: 'string' })).toThrow()

    const deepPartial2 = zodDeepPartial(
      z.union([
        z.object({
          t: z.literal('a'),
          s: z.string(),
        }),
        z.object({ t: z.literal('b'), n: z.number() }),
      ])
    )

    expect(deepPartial2.parse({ s: 'a' })).toEqual({ s: 'a' })
    expect(deepPartial2.parse({ n: 2 })).toEqual({ n: 2 })
  })

  test('partial of discriminated union', () => {
    const deepPartial = zodDeepPartial(
      z.discriminatedUnion('t', [
        z.object({ t: z.literal('s1'), s: z.string() }),
        z.object({ t: z.literal('n1'), n: z.number() }),
      ])
    )

    expect(deepPartial.parse({ t: 's1' })).toEqual({ t: 's1' })
    expect(deepPartial.parse({ t: 's1', s: 's' })).toEqual({ t: 's1', s: 's' })
    expect(deepPartial.parse({ t: 'n1', n: 10 })).toEqual({ t: 'n1', n: 10 })

    expect(() => deepPartial.parse({ n: 10 })).toThrow()
    expect(() => deepPartial.parse({ s: 's' })).toThrow()
    expect(() => deepPartial.parse({})).toThrow()
  })

  test('partial of intersection', () => {
    const deepPartial = zodDeepPartial(
      z.object({ t: z.literal('t1') }).and(z.object({ y: z.literal('y1') }))
    )

    expect(deepPartial.parse({})).toEqual({})
    expect(deepPartial.parse({ t: 't1' })).toEqual({ t: 't1' })
    expect(deepPartial.parse({ t: 't1', y: 'y1' })).toEqual({
      t: 't1',
      y: 'y1',
    })

    expect(() => deepPartial.parse({ t: 't2' })).toThrow()
    expect(() => deepPartial.parse({ y: 'y2' })).toThrow()
  })
})

describe('patched zod', () => {
  test('should return true for same schema', () => {
    expect(z.object({}) instanceof z.ZodObject).toBeTruthy()
    expect(z.object({ prop: z.number() }) instanceof z.ZodObject).toBeTruthy()
    expect(z.literal('TEST') instanceof z.ZodLiteral).toBeTruthy()
    expect(z.union([z.number(), z.string()]) instanceof z.ZodUnion).toBeTruthy()
    expect(
      z.intersection(z.literal('TEST'), z.string()) instanceof z.ZodIntersection
    ).toBeTruthy()
    expect(z.ZodNumber.create() instanceof z.ZodNumber).toBeTruthy()
  })
  test('should return false for different schemas', () => {
    expect(z.string() instanceof z.ZodObject).toBeFalsy()
    expect(z.object({ prop: z.number() }) instanceof z.ZodNumber).toBeFalsy()
    expect(z.number().optional() instanceof z.ZodNumber).toBeFalsy()
    expect(z.number().nullable() instanceof z.ZodOptional).toBeFalsy()
    expect(z.literal('TEST') instanceof z.ZodString).toBeFalsy()
    expect(
      z.discriminatedUnion('type', [
        z.object({ type: z.literal('a') }),
        z.object({ type: z.literal('b') }),
      ]) instanceof z.ZodUnion
    ).toBeFalsy()
  })
  test('should check for inherited schemas', () => {
    class CustomZodType extends z.ZodObject<any> {}
    class InheritedCustomZodType extends CustomZodType {}

    const customZodType: unknown = new CustomZodType({} as any)
    const inheritedZodType: unknown = new InheritedCustomZodType({} as any)

    expect(z.object({}) instanceof z.ZodType).toBeTruthy()
    expect(customZodType instanceof z.ZodObject).toBeTruthy()
    expect(customZodType instanceof CustomZodType).toBeTruthy()
    expect(customZodType instanceof InheritedCustomZodType).toBeFalsy()

    expect(inheritedZodType instanceof z.ZodObject).toBeTruthy()
    expect(inheritedZodType instanceof CustomZodType).toBeTruthy()
    expect(inheritedZodType instanceof InheritedCustomZodType).toBeTruthy()
    expect(inheritedZodType instanceof z.ZodNull).toBeFalsy()
  })
})

describe('parseFieldsAsArrays', () => {
  const schema = z.object({
    strings: z.string().array(),
    numbers: z.number().array(),
  })

  test('should parse valid values successfully', () => {
    expect(parseFieldsAsArrays({ numbers: 6, strings: 's' }, schema)).toEqual({
      numbers: 6,
      strings: 's',
    })
    const withEachOperator = {
      numbers: 6,
      strings: { $each: ['s'], $otherOperator: 5 },
    }
    expect(parseFieldsAsArrays(withEachOperator, schema)).toEqual(
      withEachOperator
    )
  })

  test('should remove extra fields', () => {
    expect(
      parseFieldsAsArrays(
        { numbers: 6, strings: 's', objects: {}, maps: new Map() },
        schema
      )
    ).toEqual({
      numbers: 6,
      strings: 's',
    })
  })

  test('should throw for invalid values', () => {
    expect(() =>
      parseFieldsAsArrays({ numbers: 's', strings: 7 }, schema)
    ).toThrow()
    expect(() =>
      parseFieldsAsArrays({ numbers: 's', strings: 7 }, schema)
    ).toThrow()
    expect(() =>
      parseFieldsAsArrays({ numbers: [7], strings: ['s'] }, schema)
    ).toThrow()
    expect(() =>
      parseFieldsAsArrays({ numbers: 7, strings: { $each: [7] } }, schema)
    ).toThrow()
  })
})
