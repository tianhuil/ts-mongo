import { AggregationCursor, Document } from 'mongodb'
import { TsFilter } from './filter'
import { RemodeledOptions } from './find'
import { FlattenFilterPaths } from './flatten'
import { TsProjection } from './projection'
import { TsSort } from './sort'
import { RemodelType } from './util'

/**
 * This is an incomplete list but will do for now
 */
export declare type Pipeline<TSchema extends Document, TSchemaOther extends Document> =
  | { $match: TsFilter<TSchema> }
  | { $project: TsProjection<TSchema> }
  | { $sort: TsSort<TSchema> }
  | { $lookup: Lookup<TSchema, TSchemaOther> }

export declare type Lookup<TSchema extends Document, TSchemaOther extends Document> = {
  from: string
  localField: FlattenFilterPaths<TSchema>
  foreignField: FlattenFilterPaths<TSchemaOther>
  as: string
}

export declare type TsAggregationCursor<TSchema extends Document> = RemodelType<
  RemodeledOptions<TSchema>,
  AggregationCursor<TSchema>
>
