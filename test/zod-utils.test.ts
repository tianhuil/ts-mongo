import * as z from 'zod'
import {
  zodDeepPartial,
  parseFieldsAsArrays,
  isInstanceOfSchema,
} from '../src/zod-utils'

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

describe('isInstanceOfSchema', () => {
  test('should return true for same schema', () => {
    expect(isInstanceOfSchema(z.object({}), z.ZodObject)).toBeTruthy()
    expect(
      isInstanceOfSchema(z.object({ prop: z.number() }), z.ZodObject)
    ).toBeTruthy()
    expect(isInstanceOfSchema(z.literal('TEST'), z.ZodLiteral)).toBeTruthy()
    expect(
      isInstanceOfSchema(z.union([z.number(), z.string()]), z.ZodUnion)
    ).toBeTruthy()
    expect(
      isInstanceOfSchema(
        z.intersection(z.literal('TEST'), z.string()),
        z.ZodIntersection
      )
    ).toBeTruthy()
    expect(isInstanceOfSchema(z.ZodNumber.create(), z.ZodNumber)).toBeTruthy()
  })
  test('should return false for different schemas', () => {
    expect(isInstanceOfSchema(z.string(), z.ZodObject)).toBeFalsy()
    expect(
      isInstanceOfSchema(z.object({ prop: z.number() }), z.ZodNumber)
    ).toBeFalsy()
    expect(isInstanceOfSchema(z.number().optional(), z.ZodNumber)).toBeFalsy()
    expect(isInstanceOfSchema(z.number().nullable(), z.ZodOptional)).toBeFalsy()
    expect(isInstanceOfSchema(z.literal('TEST'), z.ZodString)).toBeFalsy()
    expect(
      isInstanceOfSchema(
        z.discriminatedUnion('type', [
          z.object({ type: z.literal('a') }),
          z.object({ type: z.literal('b') }),
        ]),
        z.ZodUnion
      )
    ).toBeFalsy()
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
