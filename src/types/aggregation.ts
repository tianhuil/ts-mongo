import { AggregationCursor, Document } from 'mongodb'
import type { Collstats } from './colstats'
import { TsFilter } from './filter'
import { FlattenFilterPaths } from './flatten'
import { TsProjection } from './projection'
import { TsSort } from './sort'
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
  | {
   /**
   * Limits the number of documents passed to the next stage in the pipeline and takes a positive integer that specifies the maximum number of documents to pass along.
   * 
   * Starting in MongoDB 5.0, the $limit pipeline aggregation has a 64-bit integer limit. Values passed to the pipeline which exceed this limit will return a invalid argument error.
   * 
   * https://www.mongodb.com/docs/manual/reference/operator/aggregation/limit/#mongodb-pipeline-pipe.-limit
   */ 
    $limit: number
  }
  | {
   /**
   * Returns statistics regarding a collection or view.
   * 
   * $collStats must be the first stage in an aggregation pipeline, or else the pipeline returns an error and it's not allowed in transactions.
   * https://www.mongodb.com/docs/manual/reference/operator/aggregation/collStats/#mongodb-pipeline-pipe.-collStats
   */ 
    $collStats: Collstats 
  }

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
