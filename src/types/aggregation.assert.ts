import * as ta from 'type-assertions'
import { Pipeline, TsLookup } from './aggregation'
import type { Collstats } from './colstats'
import { GeoNear } from './geoNear'
import { Limit } from './limit'
import { Skip } from './skip'

type CorrectExample = number
type IncorrectExample = string

type CorrectCollStatsExample = {
  latencyStats: { histograms: boolean }
  storageStats: { scale: number }
  count: {}
  queryExecStats: {}
}

type IncorrectCollStatsExample = {
  latencyStats: { histograms: number }
  storageStats: { scale: string }
  count: {}
  queryExecStats: {}
}

type geoNear = {
  near: {
    type: 'Point'
    coordinates: [number, number]
  }
  maxDistance?: number
  minDistance?: number
  spherical?: boolean
  includeLocs?: string
  distanceMultiplier?: number
}

// Coll stats example
ta.assert<ta.Extends<CorrectCollStatsExample, Collstats>>()
ta.assert<ta.Not<ta.Extends<IncorrectCollStatsExample, Collstats>>>()

// geoNear example
ta.assert<ta.Equal<geoNear, Pick<GeoNear, 'near'>>>()
// ta.assert<ta.Not<ta.Equal<geoNear, Pick<GeoNear,'near'>>>()

// Limit example
ta.assert<ta.Extends<CorrectExample, Limit>>()
ta.assert<ta.Not<ta.Extends<IncorrectExample, Limit>>>()

// Skip example
ta.assert<ta.Extends<CorrectExample, Skip>>()
ta.assert<ta.Not<ta.Extends<IncorrectExample, Skip>>>()

type ExampleTSchema = {
  a: number[]
  b: string
  c: number
}

type ExampleTSchemaOther = {
  x: number
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
    Pipeline<ExampleTSchema, ExampleTSchemaOther>
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      { $match: { a: '' } },
      Pipeline<ExampleTSchema, ExampleTSchemaOther>
    >
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      { $match: { x: [1, 2] } },
      Pipeline<ExampleTSchema, ExampleTSchemaOther>
    >
  >
>()

// Test Pipeline $project
ta.assert<
  ta.Extends<
    { $project: { a: 1 } },
    Pipeline<ExampleTSchema, ExampleTSchemaOther>
  >
>()
ta.assert<
  ta.Extends<
    { $project: { b: 1 } },
    Pipeline<ExampleTSchema, ExampleTSchemaOther>
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      { $project: { a: '1' } },
      Pipeline<ExampleTSchema, ExampleTSchemaOther>
    >
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      { $project: { x: 1 } },
      Pipeline<ExampleTSchema, ExampleTSchemaOther>
    >
  >
>()

// Test Pipeline $sort
ta.assert<
  ta.Extends<
    { $sort: { c: -1 } },
    Pipeline<ExampleTSchema, ExampleTSchemaOther>
  >
>()
ta.assert<
  ta.Extends<
    { $sort: { b: -1 } },
    Pipeline<ExampleTSchema, ExampleTSchemaOther>
  >
>()

// Test Pipeline $lookup
ta.assert<
  ta.Extends<
    { $lookup: CorrectLookupExample },
    Pipeline<ExampleTSchema, ExampleTSchemaOther>
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      { $lookup: IncorrectLookupExample },
      Pipeline<ExampleTSchema, ExampleTSchemaOther>
    >
  >
>()
