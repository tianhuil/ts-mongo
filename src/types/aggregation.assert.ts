import * as ta from 'type-assertions'
import { Pipeline } from './aggregation'
import type { Collstats } from './colstats'
import { Coordinates, GeoNear } from './geoNear'

type LimitExample = {
    limit: number
}

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
ta.assert<ta.Extends<geoNear, Pick<GeoNear,'near'>>>()


// Limit example
ta.assert<ta.Extends<{$limit: 3}, Pipeline<LimitExample, LimitExample>>>()
ta.assert<ta.Not<ta.Extends<{$limit: '3'}, Pipeline<LimitExample, LimitExample>>>>()

// Skip example
ta.assert<ta.Extends<{$skip: 3}, Pipeline<LimitExample, LimitExample>>>()
ta.assert<ta.Not<ta.Extends<{$kip: '3'}, Pipeline<LimitExample, LimitExample>>>>()

