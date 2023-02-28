import { ObjectId } from 'mongodb'
import * as ta from 'type-assertions'
import { TsMapReduceOptions } from './mapReduce'

type ExampleTSchema = {
  book_title: string
  author_name: string
  status: string
  publish_year: string
  price: number
}

// Testing for Output
ta.assert<
  ta.Extends<{ out: 'new_doc' }, TsMapReduceOptions<ExampleTSchema, ObjectId>>
>()
ta.assert<
  ta.Extends<
    { out: { replace: 'result' } },
    TsMapReduceOptions<ExampleTSchema, ObjectId>
  >
>()
ta.assert<
  ta.Extends<
    { out: { reduce: 'result' } },
    TsMapReduceOptions<ExampleTSchema, ObjectId>
  >
>()
ta.assert<
  ta.Extends<
    { out: { merge: 'result' } },
    TsMapReduceOptions<ExampleTSchema, ObjectId>
  >
>()
ta.assert<
  ta.Extends<
    { out: { inline: 1 } },
    TsMapReduceOptions<ExampleTSchema, ObjectId>
  >
>()

ta.assert<
  ta.Not<ta.Extends<{ out: 123 }, TsMapReduceOptions<ExampleTSchema, ObjectId>>>
>()
ta.assert<
  ta.Not<
    ta.Extends<
      { out: { inline: 2 } },
      TsMapReduceOptions<ExampleTSchema, ObjectId>
    >
  >
>()

// Testing for Sort Param
ta.assert<
  ta.Extends<
    { sort: { price: 1 } },
    TsMapReduceOptions<ExampleTSchema, ObjectId>
  >
>()
ta.assert<
  ta.Extends<
    { sort: { publish_year: 'asc' } },
    TsMapReduceOptions<ExampleTSchema, ObjectId>
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      { sort: { publish_year: 5 } },
      TsMapReduceOptions<ExampleTSchema, ObjectId>
    >
  >
>()

// Testing For Query Param
ta.assert<
  ta.Extends<
    { query: { price: { $gt: 50 } } },
    TsMapReduceOptions<ExampleTSchema, ObjectId>
  >
>()

ta.assert<
  ta.Not<
    ta.Extends<
      { query: { book_title: { $gt: 50 } } },
      TsMapReduceOptions<ExampleTSchema, ObjectId>
    >
  >
>()

// Testing for finalize Param
ta.assert<
  ta.Extends<{ finalize: 'test' }, TsMapReduceOptions<ExampleTSchema, ObjectId>>
>()

ta.assert<
  ta.Extends<
    { finalize: (key: ObjectId, reduce: ExampleTSchema) => ExampleTSchema },
    TsMapReduceOptions<ExampleTSchema, ObjectId>
  >
>()
