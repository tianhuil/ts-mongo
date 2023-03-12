import { AggregationCursor, Document } from 'mongodb'
import { TsChangeStreamOptions } from './changeStream'
import { TsFilter } from './filter'
import { FlattenFilterPaths } from './flatten'
import { TsProjection } from './projection'
import { TsSort } from './sort'
import { TsUnionWith } from './unionWith'
import { RemodelType } from './util'

/**
 * This is an incomplete list but will do for now
 */
export declare type Pipeline<
  TSchema extends Document,
  TSchemaOther extends Document
> =
  | { $match: TsFilter<TSchema> }
  | { $project: TsProjection<TSchema> }
  | { $sort: TsSort<TSchema> }
  | { $lookup: TsLookup<TSchema, TSchemaOther> }
  | { $changeStream: TsChangeStreamOptions }
  | { $unionWith: TsUnionWith<TSchema, TSchemaOther> }

export declare type TsLookup<
  TSchema extends Document,
  TSchemaOther extends Document
> = {
  from: string
  localField: FlattenFilterPaths<TSchema>
  foreignField: FlattenFilterPaths<TSchemaOther>
  as: string
}

export declare type TsAggregationCursor<TSchema extends Document> = RemodelType<
  {
    sort?: TsSort<TSchema>
    projection?: TsProjection<TSchema>
  },
  AggregationCursor<TSchema>
>
