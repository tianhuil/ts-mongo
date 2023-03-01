import { Document, MapReduceOptions, ObjectId } from 'mongodb'
import { TsFilter } from './filter'
import { TsSort } from './sort'
import { RemodelType } from './util'

// MapReduceOptions output type contains inline, which probably should be string?
export type MapReduceOutput =
  | string
  | { inline: 1 }
  | { replace: string }
  | { reduce: string }
  | { merge: string }

export declare type TsMapReduceOptions<
  TSchema extends Document,
  key = ObjectId
> = RemodelType<
  {
    out?: MapReduceOutput
    sort?: TsSort<TSchema>
    query?: TsFilter<TSchema>
  },
  MapReduceOptions<key, TSchema>
>
