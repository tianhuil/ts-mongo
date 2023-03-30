import { ObjectId } from 'mongodb'
import * as ta from 'type-assertions'
import { FilterType, TsFilter, WithOperator, WithRecordOperator } from './filter'

// cannot use `number` in template type of object key; works if you use specific numbers
ta.assert<ta.Extends<'a20b', `a${number}b`>>()
ta.assert<ta.Not<ta.Extends<'does-not-match-pattern', `a${number}b`>>>()
ta.assert<ta.Extends<{ a20b: true }, { [x in `a${number}b`]: boolean }>>()
ta.assert<
  ta.Extends<
    { 'does-not-match-pattern': true },
    { [x in `a${number}b`]: boolean }
  >
>()
ta.assert<
  ta.Extends<{ 'does-not-match-pattern': true }, Record<`a${number}b`, boolean>>
>()
ta.assert<
  ta.Not<
    ta.Extends<
      { 'does-not-match-pattern': true },
      { [x in `a${1 | 2 | 3}b`]: boolean }
    >
  >
>()

// Test WithOperator number
ta.assert<ta.Extends<{ $eq: 2 }, WithOperator<number>>>()
ta.assert<ta.Extends<{ $nin: [2, 3] }, WithOperator<number>>>()
ta.assert<ta.Not<ta.Extends<{ $eq: 'A' }, WithOperator<number>>>>()
ta.assert<ta.Extends<{ $lt: 2 }, WithOperator<number>>>()

// Test WithOperator string
ta.assert<ta.Extends<{ $eq: 'a' }, WithOperator<string>>>()
const regex = { $regex: /hi/ }
ta.assert<ta.Extends<typeof regex, WithOperator<string>>>()
ta.assert<
  ta.Extends<
    {
      $text: {
        $search: 'a'
      }
    },
    WithOperator<string>
  >
>()
ta.assert<ta.Not<ta.Extends<{ $lt: 'a' }, WithOperator<string>>>>()
ta.assert<ta.Not<ta.Extends<{ $lt: 2 }, WithOperator<string>>>>()

// Test WithOperator number
ta.assert<ta.Extends<2, WithOperator<number>>>()
ta.assert<ta.Extends<{ $eq: 2 }, WithOperator<number>>>()
ta.assert<ta.Extends<{ $gte: 2 }, WithOperator<number>>>()
ta.assert<ta.Not<ta.Extends<{ $eq: 'a' }, WithOperator<number>>>>()
ta.assert<ta.Extends<{ $exists: true }, WithOperator<number>>>()
ta.assert<ta.Not<ta.Extends<{ $exists: 2 }, WithOperator<number>>>>()
ta.assert<ta.Not<ta.Extends<{ $text: 'hi' }, WithOperator<number>>>>()
ta.assert<ta.Not<ta.Extends<{ $size: 1 }, WithOperator<number>>>>()

// Test WithOperator string
ta.assert<ta.Extends<'a', WithOperator<string>>>()
ta.assert<ta.Extends<{ $eq: 'a' }, WithOperator<string>>>()
ta.assert<ta.Not<ta.Extends<{ $gt: 'a' }, WithOperator<string>>>>()
ta.assert<ta.Not<ta.Extends<{ $gt: 2 }, WithOperator<string>>>>()

// Test WithOperator array
ta.assert<ta.Extends<{ $size: 2 }, WithOperator<string[]>>>()
ta.assert<ta.Not<ta.Extends<{ $size: 'a' }, WithOperator<string[]>>>>()
ta.assert<ta.Extends<{ $all: ['a', 'b'] }, WithOperator<string[]>>>()
ta.assert<ta.Not<ta.Extends<{ $all: [2] }, WithOperator<string[]>>>>()
ta.assert<ta.Not<ta.Extends<{ $all: 'a' }, WithOperator<string[]>>>>()
ta.assert<ta.Extends<{ $size: 2 }, WithOperator<{ a: number }[]>>>()
ta.assert<ta.Extends<{ $all: [{ a: 2 }] }, WithOperator<{ a: number }[]>>>()
ta.assert<
  ta.Extends<
    { $all: [{ $elemMatch: { a: { $gte: 4 } } }] },
    WithOperator<{ a: number }[]>
  >
>()
ta.assert<ta.Extends<{ a: 2 }, WithOperator<{ a: number }>>>()

// Test Filter equivalence
// https://docs.mongodb.com/manual/reference/operator/query/all/
ta.assert<ta.Extends<{ a: [2, 3] }, TsFilter<{ a: number[] }>>>()
ta.assert<ta.Extends<{ a: { $all: [2, 3] } }, TsFilter<{ a: number[] }>>>()
ta.assert<ta.Extends<{ $and: [{ a: [2, 3] }] }, TsFilter<{ a: number[] }>>>()
ta.assert<ta.Extends<{ a: [2, 3] }, WithOperator<{ a: number[] }>>>()

// Test WithOperator negation
ta.assert<ta.Extends<{ $not: { $gt: 2 } }, WithOperator<number>>>()
ta.assert<ta.Not<ta.Extends<{ $not: { $eq: 2 } }, WithOperator<string>>>>()

// Test WithOperator -- directly accessing value
ta.assert<ta.Extends<4, WithOperator<number>>>()
ta.assert<ta.Not<ta.Extends<'a', WithOperator<number>>>>()
ta.assert<ta.Extends<'a', WithOperator<string>>>()

// Test WithLogicalOperators
ta.assert<ta.Extends<{ a: { $gt: 2 } }, TsFilter<{ a: number }>>>()
ta.assert<
  ta.Extends<
    { $and: [{ a: { $gt: 2 } }, { a: { $lt: 5 } }] },
    TsFilter<{ a: number }>
  >
>()
ta.assert<
  ta.Extends<
    {
      $and: [
        { $or: [{ a: { $gt: 2 } }, { a: { $lt: 5 } }] },
        { $or: [{ a: { $gt: 2 } }, { a: { $lt: 5 } }] }
      ]
    },
    TsFilter<{ a: number }>
  >
>()
ta.assert<
  ta.Not<ta.Extends<{ $and: { a: { $gt: 3 } } }, TsFilter<{ a: number }>>>
>()

// Test $not operator
ta.assert<ta.Extends<{ a: { $not: { $gt: 2 } } }, TsFilter<{ a: number }>>>()
ta.assert<
  ta.Extends<
    { a: { $not: { $text: { $search: 'a' } } } },
    TsFilter<{ a: string }>
  >
>()

// Test $in operator
ta.assert<ta.Extends<{ a: { $in: number[] } }, TsFilter<{ a: number }>>>()

// Test FlattenPaths / FlattenType
type Example = {
  a: number
  b: {
    c: string
    d: {
      e: boolean
    }
    f: ObjectId[]
    g: null
    h: number | null
  }
}

ta.assert<ta.Extends<number, FilterType<Example, 'a'>>>()
ta.assert<ta.Not<ta.Extends<string, FilterType<Example, 'a'>>>>()
ta.assert<ta.Extends<string, FilterType<Example, 'b.c'>>>()
ta.assert<ta.Not<ta.Extends<number, FilterType<Example, 'b.c'>>>>()
ta.assert<ta.Extends<boolean, FilterType<Example, 'b.d.e'>>>()
ta.assert<ta.Extends<boolean, FilterType<Example, 'b.d.e'>>>()
ta.assert<ta.Extends<{ e: boolean }, FilterType<Example, 'b.d'>>>()
ta.assert<
  ta.Extends<
    {
      c: string
      d: {
        e: boolean
      }
    },
    FilterType<Example, 'b'>
  >
>()
ta.assert<ta.Extends<ObjectId[], FilterType<Example, 'b.f'>>>()
ta.assert<ta.Extends<null, FilterType<Example, 'b.g'>>>()
ta.assert<ta.Extends<null | number, FilterType<Example, 'b.h'>>>()
ta.assert<ta.Extends<{ $size: 2 }, FilterType<Example, 'b.f'>>>()

// Test FilterType - with operators
ta.assert<ta.Extends<{ $lt: 2 }, FilterType<Example, 'a'>>>()
ta.assert<
  ta.Extends<{ $text: { $search: 'hi' } }, FilterType<Example, 'b.c'>>
>()
ta.assert<ta.Extends<{ $exists: true }, FilterType<Example, 'b.d'>>>()
ta.assert<ta.Extends<{ e: { $eq: false } }, FilterType<Example, 'b.d'>>>()
ta.assert<ta.Extends<{ $size: 2 }, FilterType<Example, 'b.f'>>>()
ta.assert<ta.Extends<{ $in: number[] }, FilterType<Example, 'a'>>>()
ta.assert<
  ta.Extends<{ $and: [{ $lt: 2 }, { $gt: 0 }] }, FilterType<Example, 'a'>>
>()

// These use to be wrong, keeping as regression testing
ta.assert<ta.Not<ta.Extends<{ a: 2 }, WithOperator<{ a: number }[]>>>>()

// Disallow extraneous fields, except when index supports number
ta.assert<ta.Not<ta.Extends<{ z: 2 }, TsFilter<{ a: number; b: string[] }>>>>()
ta.assert<ta.Extends<{ z: 2 }, TsFilter<{ a: number; b: string[] }, number>>>()


// Test WithRecordOperator with unions
type ExampleUnion = {
  type: 'a' | 'b' | 'c' | 'd',
  nested: { a: 1 | 2 | 3 } | { b: 4 | 5 | 6 }
}

ta.assert<
  ta.Extends<{ type: { $in: ['a', 'c'] } }, WithRecordOperator<ExampleUnion>>
>()
ta.assert<
  ta.Not<ta.Extends<{ type: { $in: ['d', 'f'] } }, WithRecordOperator<ExampleUnion>>>
>()

ta.assert<
  ta.Extends<{ 'nested.a': { $in: [1, 2] } }, WithRecordOperator<ExampleUnion>>
>()
ta.assert<
  ta.Extends<{ 'nested.b': { $in: [4, 6] } }, WithRecordOperator<ExampleUnion>>
>()
ta.assert<
  ta.Not<ta.Extends<{ 'nested.b': { $in: [1, 7] } }, WithRecordOperator<ExampleUnion>>>
>()

ta.assert<
  ta.Extends<
    { 'nested': { $in: [{ a: 1 }, { b: 5 }] } },
    WithRecordOperator<ExampleUnion>
  >
>()
ta.assert<
  ta.Not<ta.Extends<
    { 'nested': { $in: [{ a: 0 }, { b: 7 }] } },
    WithRecordOperator<ExampleUnion>
  >>
>()

ta.assert<
  ta.Extends<{ type: { $in: ['a', 'c'] } }, TsFilter<ExampleUnion>>
>()
ta.assert<
  ta.Not<ta.Extends<{ type: { $in: ['d', 'f'] } }, TsFilter<ExampleUnion>>>
>()


type ExampleDiscriminatedUnion =
  | { type: 'a'; bar: string }
  | { type: 'b'; baz: number }
  | { type: 'c'; foo: { subtype: 'a' } | { subtype: 'b' } | { subtype: 'c' }}

ta.assert<
  ta.Extends<{ type: { $in: ['a', 'b'] } }, WithRecordOperator<ExampleDiscriminatedUnion>>
>()
ta.assert<
  ta.Not<ta.Extends<{ type: { $in: ['c', 'd'] } }, WithRecordOperator<ExampleDiscriminatedUnion>>>
>()
ta.assert<
  ta.Extends<{ baz: { $in: [1, 2] }, bar: { $in: ["test1", "test2"] }}, WithRecordOperator<ExampleDiscriminatedUnion>>
>()

ta.assert<
  ta.Extends<{ 'foo.subtype': { $in: ['a', 'b'] } }, WithRecordOperator<ExampleDiscriminatedUnion>>
>()
ta.assert<
  ta.Not<ta.Extends<{ 'foo.subtype': { $in: ['c', 'd'] } }, WithRecordOperator<ExampleDiscriminatedUnion>>>
>()

ta.assert<
  ta.Extends<{ type: { $in: ['a', 'b'] } }, TsFilter<ExampleDiscriminatedUnion>>
>()
ta.assert<
  ta.Not<ta.Extends<{ 'foo.subtype': { $in: ['c', 'd'] } }, TsFilter<ExampleDiscriminatedUnion>>>
>()
