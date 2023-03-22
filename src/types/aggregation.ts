import { AggregationCursor, Document } from 'mongodb'
import { TsChangeStreamOptions } from './changeStream'
import type { Collstats } from './colstats'
import { TsFilter } from './filter'
import { FlattenFilterPaths } from './flatten'
import { GeoNear } from './geoNear'
import { TsProjection } from './projection'
import { TsSort } from './sort'
import { TsUnionWith } from './unionWith'
import { RemodelType } from './util'

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
  | {
      /**
       * Skips over the specified number of documents that pass into the stage and passes the remaining documents to the next stage in the pipeline.
       * it takes a positive integer that specifies the maximum number of documents to skip.
       *
       * Starting in MongoDB 5.0, the $skip pipeline aggregation has a 64-bit integer limit. Values passed to the pipeline which exceed this limit will return a invalid argument error.
       * https://www.mongodb.com/docs/manual/reference/operator/aggregation/skip/#mongodb-pipeline-pipe.-skip
       */
      $skip: number
    }
  | {
      /**
       * Outputs documents in order of nearest to farthest from a specified point.
       * - Starting in version 4.2, MongoDB removes the limit and num options for the $geoNear stage as well as the default limit of 100 documents. To limit the results of $geoNear, use the $geoNear stage with the $limit stage.
       * https://www.mongodb.com/docs/manual/reference/operator/aggregation/geoNear/#mongodb-pipeline-pipe.-geoNear
       */
      $geoNear: GeoNear<TsFilter<TSchema>>
    }
  | { $lookup: TsLookup<TSchema, TSchemaLookup> }
  | { $changeStream: TsChangeStreamOptions }
  | { $unionWith: TsUnionWith<TSchemaUnionWith> }

export declare type TsLookup<
  TSchema extends Document,
  TSchemaLookup extends Document
> = {
  from: string
  localField: FlattenFilterPaths<TSchema>
  foreignField: FlattenFilterPaths<TSchemaLookup>
  as: string
}

export declare type TsAggregationCursor<TSchema extends Document> = RemodelType<
  {
    sort?: TsSort<TSchema>
    projection?: TsProjection<TSchema>
  },
  AggregationCursor<TSchema>
>
