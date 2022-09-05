import { AggregationCursor, Document } from 'mongodb'
import { Filter } from './filter'
import { RemodeledOptions } from './find'
import { FlattenFilterPaths } from './flatten'
import { Projection } from './projection'
import { Sort } from './sort'
import { RemodelType } from './util'

/**
 * This is an incomplete list but will do for now
 */
export declare type Pipeline<
  TSchema extends Document,
  TSchemaOther extends Document
> =
  | { $match: Filter<TSchema> }
  | { $project: Projection<TSchema> }
  | { $sort: Sort<TSchema> }
  | { $lookup: Lookup<TSchema, TSchemaOther> }

export declare type Lookup<
  TSchema extends Document,
  TSchemaOther extends Document
> = {
  from: string
  localField: FlattenFilterPaths<TSchema>
  foreignField: FlattenFilterPaths<TSchemaOther>
  as: string
}

export declare type TsAggregationCursor<TSchema extends Document> = RemodelType<
  RemodeledOptions<TSchema>,
  AggregationCursor<TSchema>
>
