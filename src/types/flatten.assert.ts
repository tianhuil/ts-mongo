import { ObjectId } from 'mongodb'
import * as ta from 'type-assertions'
import {
  FlattenFilterPaths,
  FlattenFilterType,
  FlattenUpdatePaths,
  FlattenUpdateType,
} from './flatten'

type Example = {
  a: number
  b: {
    c: string
    d: {
      e: boolean
    }
  }
  f: ObjectId[]
  g: {
    h: number
  }[]
}

ta.assert<
  ta.Equal<
    | '_id'
    | 'a'
    | 'b'
    | 'b.c'
    | 'b.d.e'
    | 'b.d'
    | 'f'
    | `f.0`
    | 'g'
    | `g.0`
    | `g.0.h`
    | 'g.h',
    FlattenFilterPaths<Example>
  >
>()

ta.assert<
  ta.Equal<
    | '_id'
    | 'a'
    | 'b'
    | 'b.c'
    | 'b.d.e'
    | 'b.d'
    | 'f'
    | `f.${number}`
    | 'g'
    | `g.${number}`
    | `g.${number}.h`
    | 'g.h',
    FlattenFilterPaths<Example, number>
  >
>()

ta.assert<
  ta.Equal<
    | '_id'
    | 'a'
    | 'b'
    | 'b.c'
    | 'b.d.e'
    | 'b.d'
    | 'f'
    | 'f.$'
    | 'f.$[]'
    | 'g'
    | 'g.$'
    | 'g.$.h'
    | 'g.$[]'
    | 'g.$[].h'
    | 'g.h',
    FlattenUpdatePaths<Example>
  >
>()

ta.assert<ta.Equal<FlattenFilterType<Example, '_id'>, ObjectId>>()
ta.assert<ta.Equal<FlattenFilterType<Example, 'a'>, number>>()
ta.assert<
  ta.Equal<FlattenFilterType<Example, 'b'>, { c: string; d: { e: boolean } }>
>()
ta.assert<ta.Equal<FlattenFilterType<Example, 'b.c'>, string>>()
ta.assert<ta.Equal<FlattenFilterType<Example, 'b.d'>, { e: boolean }>>()
ta.assert<ta.Equal<FlattenFilterType<Example, 'b.d.e'>, boolean>>()
ta.assert<ta.Equal<FlattenFilterType<Example, 'b.d'>, { e: boolean }>>()
ta.assert<ta.Equal<FlattenFilterType<Example, 'f'>, ObjectId[]>>()
ta.assert<ta.Equal<FlattenFilterType<Example, 'f.4'>, ObjectId>>()
ta.assert<ta.Equal<FlattenFilterType<Example, 'g'>, { h: number }[]>>()
ta.assert<ta.Equal<FlattenFilterType<Example, 'g.0'>, { h: number }>>()
ta.assert<ta.Equal<FlattenFilterType<Example, 'g.0.h'>, number>>()
ta.assert<ta.Equal<FlattenFilterType<Example, 'g.h'>, number>>()
ta.assert<ta.Equal<FlattenFilterType<Example, 'z'>, never>>()

ta.assert<ta.Equal<FlattenUpdateType<Example, 'g.$'>, { h: number }>>()
ta.assert<ta.Equal<FlattenUpdateType<Example, 'g.$.h'>, number>>()
ta.assert<ta.Equal<FlattenUpdateType<Example, 'g.h'>, number>>()
