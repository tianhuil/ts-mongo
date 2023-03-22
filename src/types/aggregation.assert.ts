import { ResumeToken } from 'mongodb'
import * as ta from 'type-assertions'
import { TsLookup, TsPipeline } from './aggregation'

type ExampleTSchema = {
  a: number[]
  b: string
  c: number
}

type ExampleTSchemaOther = {
  x: number
}

type ExampleTSchemaUnionWith = {
  a: number[]
  b: string
}

type CorrectLookupExample = {
  from: ''
  localField: 'a'
  foreignField: 'x'
  as: ''
}
type IncorrectLookupExample = {
  from: ''
  localField: 'a'
  foreignField: 'd'
  as: ''
}

// Test TsLookup equivalence
ta.assert<
  ta.Extends<
    CorrectLookupExample,
    TsLookup<ExampleTSchema, ExampleTSchemaOther>
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      IncorrectLookupExample,
      TsLookup<ExampleTSchema, ExampleTSchemaOther>
    >
  >
>()

// Test Pipeline $match
ta.assert<
  ta.Extends<
    { $match: { a: [1, 2] } },
    TsPipeline<ExampleTSchema, ExampleTSchemaOther>
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      { $match: { a: '' } },
      TsPipeline<ExampleTSchema, ExampleTSchemaOther>
    >
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      { $match: { x: [1, 2] } },
      TsPipeline<ExampleTSchema, ExampleTSchemaOther>
    >
  >
>()

// Test Pipeline $project
ta.assert<
  ta.Extends<
    { $project: { a: 1 } },
    TsPipeline<ExampleTSchema, ExampleTSchemaOther>
  >
>()
ta.assert<
  ta.Extends<
    { $project: { b: 1 } },
    TsPipeline<ExampleTSchema, ExampleTSchemaOther>
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      { $project: { a: '1' } },
      TsPipeline<ExampleTSchema, ExampleTSchemaOther>
    >
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      { $project: { x: 1 } },
      TsPipeline<ExampleTSchema, ExampleTSchemaOther>
    >
  >
>()

// Test Pipeline $sort
ta.assert<
  ta.Extends<
    { $sort: { c: -1 } },
    TsPipeline<ExampleTSchema, ExampleTSchemaOther>
  >
>()
ta.assert<
  ta.Extends<
    { $sort: { b: -1 } },
    TsPipeline<ExampleTSchema, ExampleTSchemaOther>
  >
>()

// Test Pipeline $lookup
ta.assert<
  ta.Extends<
    { $lookup: CorrectLookupExample },
    TsPipeline<ExampleTSchema, ExampleTSchemaOther>
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      { $lookup: IncorrectLookupExample },
      TsPipeline<ExampleTSchema, ExampleTSchemaOther>
    >
  >
>()

// Test Pipeline $changeStream
ta.assert<
  ta.Extends<
    { $changeStream: { fullDocument: 'updateLookup' } },
    TsPipeline<ExampleTSchema, ExampleTSchemaOther>
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      {
        $changeStream: {
          resumeAfter: ResumeToken
          startAfter: ResumeToken
        }
      },
      TsPipeline<ExampleTSchema, ExampleTSchemaOther>
    >
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      { $changeStream: { startAtOperationTime: number } },
      TsPipeline<ExampleTSchema, ExampleTSchemaOther>
    >
  >
>()

// Test Pipeline $unionWith
ta.assert<
  ta.Extends<
    { $unionWith: { coll: string; pipeline: [{ $match: { a: [1, 2] } }] } },
    TsPipeline<ExampleTSchema, ExampleTSchemaOther, ExampleTSchemaUnionWith>
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      {
        $unionWith: {
          coll: string
          pipeline: [{ $match: { a: [1, 2] } }, { $merge: { into: string } }]
        }
      },
      TsPipeline<ExampleTSchema, ExampleTSchemaOther, ExampleTSchemaUnionWith>
    >
  >
>()
