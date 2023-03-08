import * as ta from 'type-assertions'
import { Pipeline, TsLookup } from './aggregation'
import { Collstats } from './colstats'
import { GeoNear } from './geoNear'

type LimitExample = number
type SkipExample = number
type queryExample = {
  category: string
}

type geoNear = {
  near: {
    type: 'Point'
    coordinates: [number, number]
  }
}

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

// Test $collstats pipeline
ta.assert<
  ta.Extends<
    { latencyStats?: { histograms: boolean } },
    Pick<Collstats, 'latencyStats'>
  >
>()
ta.assert<
  ta.Extends<
    { storageStats: { scale: number } },
    Pick<Collstats, 'storageStats'>
  >
>()
ta.assert<ta.Extends<{ count: {} }, Pick<Collstats, 'count'>>>()
ta.assert<
  ta.Extends<{ queryExecStats: {} }, Pick<Collstats, 'queryExecStats'>>
>()

// Test $geoNear pipeline
ta.assert<ta.Extends<geoNear, Pick<GeoNear, 'near'>>>()
ta.assert<ta.Extends<{ maxDistance: number }, Pick<GeoNear, 'maxDistance'>>>()
ta.assert<
  ta.Extends<{ distanceField: string }, Pick<GeoNear, 'distanceField'>>
>()
ta.assert<ta.Extends<{ minDistance: number }, Pick<GeoNear, 'minDistance'>>>()
ta.assert<ta.Extends<{ spherical: boolean }, Pick<GeoNear, 'spherical'>>>()
ta.assert<ta.Extends<{ includeLocs: string }, Pick<GeoNear, 'includeLocs'>>>()
ta.assert<
  ta.Extends<
    { distanceMultiplier: number },
    Pick<GeoNear, 'distanceMultiplier'>
  >
>()
ta.assert<
  ta.Extends<
    { query: { category: string } },
    Pick<GeoNear<queryExample>, 'query'>
  >
>()

// Test $limit pipeline
ta.assert<
  ta.Extends<
    { $limit: LimitExample },
    Pipeline<ExampleTSchema, ExampleTSchemaOther>
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      { $limit: string },
      Pipeline<ExampleTSchema, ExampleTSchemaOther>
    >
  >
>()

// Test $skip pipeline
ta.assert<
  ta.Extends<
    { $skip: SkipExample },
    Pipeline<ExampleTSchema, ExampleTSchemaOther>
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<{ $kip: string }, Pipeline<ExampleTSchema, ExampleTSchemaOther>>
  >
>()
