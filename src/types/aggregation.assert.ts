import * as ta from 'type-assertions'
import { TsLookup } from './aggregation'

// Test TsLookup equivalence
ta.assert<ta.Extends<{ from: '', localField: 'a', foreignField: 'b', as: ''}, TsLookup<{ a: number[] }, { b: number }>>>()
ta.assert<ta.Not<ta.Extends<{ from: '', localField: 'a', foreignField: 'c', as: ''}, TsLookup<{ a: number[] }, { b: number }>>>>()
