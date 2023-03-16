import { ObjectId } from 'mongodb'
import * as ta from 'type-assertions'
import { TsMapReduceOptions, TsReduceFunction } from './mapReduce'

type Example = {
  a: number
  b: string[]
  c: {
    d: number
  }
}

//test for sort option

ta.assert<
  ta.Extends<{ sort: { a: 1 } }, TsMapReduceOptions<ObjectId, Example>>
>()
ta.assert<
  ta.Not<ta.Extends<{ sort: { a: 5 } }, TsMapReduceOptions<ObjectId, Example>>>
>()
ta.assert<
  ta.Extends<{ sort: { a: 'asc' } }, TsMapReduceOptions<ObjectId, Example>>
>()
ta.assert<
  ta.Not<
    ta.Extends<{ sort: { a: 'dsc' } }, TsMapReduceOptions<ObjectId, Example>>
  >
>()

//asserting for projection option

ta.assert<
  ta.Extends<{ projection: { a: 1 } }, TsMapReduceOptions<ObjectId, Example>>
>()
ta.assert<
  ta.Not<
    ta.Extends<
      { projection: { b: [1, 2] } },
      TsMapReduceOptions<ObjectId, Example>
    >
  >
>()

//asserting for query option

ta.assert<
  ta.Extends<{ query: { b: ['a'] } }, TsMapReduceOptions<ObjectId, Example>>
>()
ta.assert<
  ta.Extends<
    { query: { 'c.d': { $gt: 3 } } },
    TsMapReduceOptions<ObjectId, Example>
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      { query: { a: 'abc '; b: ['a'] } },
      TsMapReduceOptions<ObjectId, Example>
    >
  >
>()

//asserting for reduce function

ta.assert<
  ta.Extends<
    (a: ObjectId, b: Example[]) => Example,
    TsReduceFunction<ObjectId, Example>
  >
>()

ta.assert<
  ta.Not<
    ta.Extends<
      (a: string, b: Example[]) => Example,
      TsReduceFunction<ObjectId, Example>
    >
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      (a: ObjectId, b: string[]) => string,
      TsReduceFunction<ObjectId, Example>
    >
  >
>()

//asserting for finalize option

ta.assert<
  ta.Extends<{ finalize: string }, TsMapReduceOptions<ObjectId, Example>>
>()
ta.assert<
  ta.Not<
    ta.Extends<{ finalize: number }, TsMapReduceOptions<ObjectId, Example>>
  >
>()
ta.assert<
  ta.Extends<
    { finalize: (a: string, b: Example) => any },
    TsMapReduceOptions<string, Example>
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      { finalize: (a: string, b: Example) => any },
      TsMapReduceOptions<ObjectId, Example>
    >
  >
>()
