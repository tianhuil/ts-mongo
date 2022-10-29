import { ObjectId } from 'mongodb'
import * as ta from 'type-assertions'
import { TsSort } from './sort'

type Example = {
  a: number
  b: {
    c: string
    d: {
      e: boolean
    }
  }
  f: ObjectId
  g: Date
}

ta.assert<ta.Extends<{ a: 1 }, TsSort<Example>>>()
ta.assert<ta.Extends<{ 'b.c': 1 }, TsSort<Example>>>()
ta.assert<ta.Extends<{ 'b.c': { $meta: 'textScore' } }, TsSort<Example>>>()
ta.assert<ta.Extends<{ 'b.d.e': 1 }, TsSort<Example>>>()
ta.assert<ta.Extends<{ f: 1 }, TsSort<Example>>>()
ta.assert<ta.Extends<{ g: 1 }, TsSort<Example>>>()
