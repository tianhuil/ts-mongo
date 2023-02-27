import { ObjectId } from 'mongodb'
import * as ta from 'type-assertions'
import { TsProjection } from './projection'

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

ta.assert<ta.Extends<{ a: 1 }, TsProjection<Example>>>()
ta.assert<ta.Extends<{ b: 1 }, TsProjection<Example>>>()
ta.assert<ta.Extends<{ 'b.c': 1 }, TsProjection<Example>>>()
ta.assert<ta.Extends<{ 'b.d': 1 }, TsProjection<Example>>>()
ta.assert<ta.Extends<{ 'b.d.e': 1 }, TsProjection<Example>>>()
ta.assert<ta.Extends<{ f: 1 }, TsProjection<Example>>>()
ta.assert<ta.Extends<{ 'f.$': 1 }, TsProjection<Example>>>()
ta.assert<ta.Extends<{ f: { $slice: 2 } }, TsProjection<Example>>>()
ta.assert<ta.Extends<{ f: { $slice: [2, 4] } }, TsProjection<Example>>>()
ta.assert<ta.Extends<{ g: 1 }, TsProjection<Example>>>()
ta.assert<ta.Extends<{ 'g.$': 1 }, TsProjection<Example>>>()
ta.assert<ta.Extends<{ g: { $elemMatch: { h: 2 } } }, TsProjection<Example>>>()
ta.assert<
  ta.Extends<{ g: { $elemMatch: { h: { $lt: 5 } } } }, TsProjection<Example>>
>()
ta.assert<ta.Not<ta.Extends<{ 'a.$': 1 }, TsProjection<Example>>>>()
ta.assert<ta.Not<ta.Extends<{ 'a.b.$': 1 }, TsProjection<Example>>>>()
