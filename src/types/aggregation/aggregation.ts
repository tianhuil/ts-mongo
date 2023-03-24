import { AggregationCursor, Document } from 'mongodb'
import { TsFilter } from '../filter'
import { TsProjection } from '../projection'
import { TsSort } from '../sort'
import { RemodelType } from '../util'
import { TsChangeStreamOptions } from './changeStream'
import { TsLookup } from './lookup'
import { TsUnionWith } from './unionWith'

/**
 * This is an incomplete list but will do for now
 */
export declare type TsPipeline<
  TSchema extends Document,
  TSchemaLookup extends Document,
  TSchemaUnionWith extends Document = Document
> =
  | { $match: TsFilter<TSchema> }
  | { $project: TsProjection<TSchema> }
  | { $sort: TsSort<TSchema> }
  | { $lookup: TsLookup<TSchema, TSchemaLookup> }
  | { $changeStream: TsChangeStreamOptions }
  | { $unionWith: TsUnionWith<TSchemaUnionWith> }

export declare type TsAggregationCursor<TSchema extends Document> = RemodelType<
  {
    sort?: TsSort<TSchema>
    projection?: TsProjection<TSchema>
  },
  AggregationCursor<TSchema>
>
