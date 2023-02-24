import * as ta from 'type-assertions'
import { Pipeline } from './aggregation'
import type { Collstats } from './colstats'

type LimitExample = {
    limit: number
}

type CorrectCollStatsExample = {
    latencyStats: { histograms: true },
    storageStats: { scale: 1 },
    count: {},
    queryExecStats: {}
}

type IncorrectCollStatsExample = {
    latencyStats: { histograms: 2 },
    storageStats: { scale: '1' },
    count: {},
    queryExecStats: {}
}

// Limit example
ta.assert<ta.Extends<{$limit: 3}, Pipeline<LimitExample, LimitExample>>>()
ta.assert<ta.Not<ta.Extends<{$limit: '3'}, Pipeline<LimitExample, LimitExample>>>>()

// Coll stats example
ta.assert<ta.Extends<{$collStats: CorrectCollStatsExample}, Pipeline<Collstats, Collstats>>>()
ta.assert<ta.Not<ta.Extends<{$collStats: IncorrectCollStatsExample}, Pipeline<Collstats, Collstats>>>>()