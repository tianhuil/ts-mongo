import * as ta from 'type-assertions'
import { Pipeline } from './aggregation'
import type { Collstats } from './colstats'
import { Coordinates, GeoNear } from './geoNear'
import { Limit } from './limit'
import { Skip } from './skip'

type CorrectExample = number
type IncorrectExample = string

type CorrectCollStatsExample = {
    latencyStats: { histograms: boolean },
    storageStats: { scale: number },
    count: {},
    queryExecStats: {}
}

type IncorrectCollStatsExample = {
    latencyStats: { histograms: number },
    storageStats: { scale: string },
    count: {},
    queryExecStats: {}
}

type geoNear = {
    near:{
        type: 'Point'
        coordinates: [number, number]
    }
    maxDistance?: number
    minDistance?:number
    spherical?: boolean
    includeLocs?: string
    distanceMultiplier?: number
}

// Coll stats example
ta.assert<ta.Extends<CorrectCollStatsExample, Collstats>>()
ta.assert<ta.Not<ta.Extends<IncorrectCollStatsExample, Collstats>>>()

// geoNear example
ta.assert<ta.Equal<geoNear, Pick<GeoNear,'near'>>>()
// ta.assert<ta.Not<ta.Equal<geoNear, Pick<GeoNear,'near'>>>()


// Limit example
ta.assert<ta.Extends<CorrectExample, Limit>>()
ta.assert<ta.Not<ta.Extends<IncorrectExample, Limit>>>()

// Skip example
ta.assert<ta.Extends<CorrectExample, Skip>>()
ta.assert<ta.Not<ta.Extends<IncorrectExample, Skip>>>()

