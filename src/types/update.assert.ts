import { ObjectId } from 'mongodb'
import * as ta from 'type-assertions'
import {
  PullAllTypes,
  PullTypes,
  SelectFlattenUpdatePaths,
  Update,
  UpdateFlattenArrayTypes,
  UpdateFlattenTypes,
} from './update'

type Example = {
  a: string
  b: {
    c: number
  }
  d: boolean[]
  e: {
    f: ObjectId
  }[]
  g: number
  h: {
    i: Date[]
  }
}

// Test SelectFlattenUpdatePaths
ta.assert<ta.Equal<'a', SelectFlattenUpdatePaths<Example, string>>>()
ta.assert<ta.Not<ta.Equal<'z', SelectFlattenUpdatePaths<Example, string>>>>()
ta.assert<ta.Not<ta.Equal<'a', SelectFlattenUpdatePaths<Example, number>>>>()
ta.assert<ta.Equal<'b.c' | 'g', SelectFlattenUpdatePaths<Example, number>>>()
ta.assert<ta.Equal<'b', SelectFlattenUpdatePaths<Example, { c: number }>>>()
ta.assert<
  ta.Equal<'d.$' | 'd.$[]', SelectFlattenUpdatePaths<Example, boolean>>
>()
ta.assert<
  ta.Not<ta.Extends<'d.x', SelectFlattenUpdatePaths<Example, boolean>>>
>()
ta.assert<ta.Not<ta.Equal<`d`, SelectFlattenUpdatePaths<Example, boolean>>>>()
ta.assert<ta.Not<ta.Equal<`d`, SelectFlattenUpdatePaths<Example, boolean>>>>()
ta.assert<
  ta.Equal<
    '_id' | 'e.f' | 'e.$.f' | 'e.$[].f',
    SelectFlattenUpdatePaths<Example, ObjectId>
  >
>()

// Test UpdateFlattenTypes
ta.assert<ta.Equal<{ a?: string }, UpdateFlattenTypes<Example, string>>>()
ta.assert<ta.Extends<{ 'b.c': number }, UpdateFlattenTypes<Example, number>>>()
ta.assert<
  ta.Equal<{ 'b.c'?: number; g?: number }, UpdateFlattenTypes<Example, number>>
>()
ta.assert<
  ta.Equal<
    { [x in `d.${number}`]: boolean | undefined },
    UpdateFlattenTypes<Example, boolean>
  >
>()
ta.assert<ta.Extends<{}, UpdateFlattenTypes<Example, boolean>>>()
ta.assert<
  ta.Not<ta.Extends<{ 'd.$': string }, UpdateFlattenTypes<Example, boolean>>>
>()
ta.assert<ta.Extends<{ 'd.$': true }, UpdateFlattenTypes<Example, boolean>>>()

// Test UpdateFlattenArrayTypes
ta.assert<ta.Extends<{ d?: boolean }, UpdateFlattenArrayTypes<Example>>>()
ta.assert<
  ta.Extends<
    { d?: { $each: boolean[]; $position: 2 } },
    UpdateFlattenArrayTypes<Example>
  >
>()
ta.assert<
  ta.Extends<{ e?: { f: ObjectId } }, UpdateFlattenArrayTypes<Example>>
>()
ta.assert<ta.Extends<{ 'h.i'?: Date }, UpdateFlattenArrayTypes<Example>>>()

// Test UpdateFlattenTypes on unknown
// note that if this has type `b?: {c: number}`, i.e. that c is required
// this is because update sets the entire record for b
// to set one record, use dot notation
ta.assert<ta.Extends<Partial<Example>, UpdateFlattenTypes<Example, unknown>>>()
ta.assert<
  ta.Extends<
    { a: ''; d: ''; 'e.f': '' },
    UpdateFlattenTypes<Example, unknown, ''>
  >
>()

// Test PullTypes

ta.assert<ta.Extends<{ d: { $eq: true } }, PullTypes<Example>>>()
ta.assert<ta.Extends<{ d: false }, PullTypes<Example>>>()
ta.assert<ta.Extends<{ 'h.i': Date }, PullTypes<Example>>>()

// Test PullTypes
ta.assert<ta.Extends<{ d: [true, false] }, PullAllTypes<Example>>>()
ta.assert<ta.Extends<{ 'h.i': Date[] }, PullAllTypes<Example>>>()

// Test Empty Update
ta.assert<ta.Extends<{}, Update<Example>>>()

// Testing on non-existing fields
ta.assert<ta.Extends<{}, UpdateFlattenTypes<Example, string>>>()
ta.assert<
  ta.Not<ta.Extends<{ z: number }, UpdateFlattenTypes<Example, number>>>
>()
ta.assert<
  ta.Not<ta.Extends<{ z: string }, UpdateFlattenTypes<Example, string>>>
>()

ta.assert<
  ta.Not<ta.Extends<{ z: string }, UpdateFlattenTypes<Example, boolean>>>
>()
ta.assert<
  ta.Not<ta.Extends<{ z: string }, UpdateFlattenTypes<Example, ObjectId>>>
>()
ta.assert<ta.Not<ta.Extends<{ z: number }, UpdateFlattenArrayTypes<Example>>>>()
ta.assert<ta.Not<ta.Extends<{ z: string }, PullTypes<Example>>>>()
ta.assert<ta.Not<ta.Extends<{ z: string }, PullAllTypes<Example>>>>()
