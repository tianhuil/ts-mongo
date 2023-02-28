import { Document, MapReduceOptions, ObjectId } from 'mongodb'
import { TsFilter } from './filter'
import { TsSort } from './sort'

// MapReduceOptions output type contains inline, which probably should be string?
export type MapReduceOutput =
  | string
  | { inline: 1 }
  | { replace: string }
  | { reduce: string }
  | { merge: string }

export type TsOmitMapReduction<TResult, Key> = Omit<
  MapReduceOptions<Key, TResult>,
  'out' | 'query' | 'sort'
>

export interface TsMapReduceOptions<TResult extends Document, Key = ObjectId>
  extends TsOmitMapReduction<TResult, Key> {
  out?: MapReduceOutput
  query?: TsFilter<TResult>
  sort?: TsSort<TResult>
}
