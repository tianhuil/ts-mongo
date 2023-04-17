import { ObjectId } from 'mongodb'
import * as ta from 'type-assertions'
import {
  Doc,
  DocumentWithId,
  NonArrayObject,
  NonNeverKeys,
  OptionalId,
  RecurPartial,
  RecurRemoveNever,
  _Doc,
  RecurFlattenUnion, FlattenUnion,
} from './util'

// Test DocumentWithId
type Obj = { a: string; _id: ObjectId }
ta.assert<ta.Extends<Obj, DocumentWithId>>()

// Test OptionalId
ta.assert<ta.Extends<Obj, OptionalId<Obj>>>()
ta.assert<ta.Extends<{ a: string }, OptionalId<Obj>>>()
ta.assert<ta.Not<ta.Extends<{ b: string; _id: ObjectId }, OptionalId<Obj>>>>()
ta.assert<ta.Not<ta.Extends<{ _id: ObjectId }, OptionalId<Obj>>>>()

// Test RecurPartial
type Example = {
  a: string
  b: {
    c: number
  }
  d: Date[]
}

ta.assert<ta.Extends<{ a?: string }, RecurPartial<Example>>>()
ta.assert<ta.Not<ta.Extends<{ z?: string }, RecurPartial<Example>>>>()
ta.assert<ta.Extends<{ b?: { c?: number } }, RecurPartial<Example>>>()
ta.assert<ta.Not<ta.Extends<{ b?: { z: number } }, RecurPartial<Example>>>>()
ta.assert<ta.Extends<{ d?: Date[] }, RecurPartial<Example>>>()
ta.assert<ta.Not<ta.Extends<{ d?: number[] }, RecurPartial<Example>>>>()

// Test NonArrayObject
ta.assert<ta.Extends<{ a: 2; b: string }, NonArrayObject>>()
ta.assert<ta.Not<ta.Extends<{ a: 2; b: string }[], NonArrayObject>>>()

interface IObj {
  a: 2
  b: string
}

type TObj = {
  a: 2
  b: string
}

const obj = {
  a: 2,
  b: 'hi',
}
type TObj2 = typeof obj

// Note: cannot use interface, must use type = { ... }
ta.assert<ta.Not<ta.Extends<IObj, NonArrayObject>>>()
ta.assert<ta.Not<ta.Extends<IObj, Record<string, unknown>>>>()

ta.assert<ta.Extends<TObj, NonArrayObject>>()
ta.assert<ta.Extends<TObj, Record<string, unknown>>>()

ta.assert<ta.Extends<TObj2, NonArrayObject>>()
ta.assert<ta.Extends<TObj2, Record<string, unknown>>>()

ta.assert<ta.Extends<string, string | number>>()
ta.assert<ta.Extends<string, unknown>>()

// Test Doc
ta.assert<ta.Extends<string, _Doc>>()
ta.assert<ta.Extends<{ a: string[]; b: { c: number; d: Date } }, Doc>>()
ta.assert<ta.Not<ta.Extends<() => void, _Doc>>>()
ta.assert<ta.Not<ta.Extends<{ a: () => void }, Doc>>>()
ta.assert<ta.Not<ta.Extends<HTMLAreaElement, _Doc>>>()
ta.assert<ta.Not<ta.Extends<{ a: HTMLAreaElement }, Doc>>>()

// Test RemoveNever
ta.assert<
  ta.Equal<NonNeverKeys<{ a: number; b: never; c: { d: string } }>, 'a' | 'c'>
>()

// Test Remove
ta.assert<ta.Equal<RecurRemoveNever<{ a: number; b: never }>, { a: number }>>()
ta.assert<
  ta.Equal<
    RecurRemoveNever<{ a: { b: number; c: never }; d: { e: never } }>,
    { a: { b: number }; d: {} }
  >
>()
ta.assert<
  ta.Equal<
    RecurRemoveNever<{ a: number[]; b: { c: string; d: never }[] }>,
    { a: number[]; b: { c: string }[] }
  >
>()

// Test FlattenUnion
// Should not affect normal objects
ta.assert<
  ta.Equal<
    FlattenUnion<{ foo: number; bar: string }>,
    { foo: number; bar: string }
  >
>()
// Should flatten unions
ta.assert<
  ta.Equal<
    FlattenUnion<{ type: 'a'; foo: number } | { type: 'b'; bar: string }>,
    { type: 'a' | 'b' }
  >
>()


// Test RecurFlattenUnion
// Should not affect base types
ta.assert<ta.Equal<RecurFlattenUnion<string>, string>>()
// Should not affect arrays
ta.assert<ta.Equal<RecurFlattenUnion<number[]>, number[]>>()
// Should not affect normal objects
ta.assert<
  ta.Equal<
    RecurFlattenUnion<{ foo: number; bar: string }>,
    { foo: number; bar: string }
  >
>()
// Should flatten unions
ta.assert<
  ta.Equal<
    RecurFlattenUnion<{ type: 'a'; foo: number } | { type: 'b'; bar: string }>,
    { type: 'a' | 'b' }
  >
>()
// Should flatten unions in objects
ta.assert<
  ta.Equal<
    RecurFlattenUnion<
      | { deep: { type: 'a'; foo: number } }
      | { deep: { type: 'b'; bar: string } }
    >,
    { deep: { type: 'a' | 'b' } }
  >
>()
