import { Document, ObjectId, WithId } from 'mongodb'
import { WithBitwiseOperator } from './bitwise'
import { FlattenFilterPaths, FlattenFilterType } from './flatten'
import { WithGeoSpatialQueryOperator } from './geospatialQuery'
import { NonArrayObject, RecurPartial } from './util'

/**
 * https://docs.mongodb.com/manual/reference/operator/query-element/
 */
export type WithElementOperator = {
  $exists?: boolean
  $type?: 'double' | 'string' | 'objectId' | 'array' | 'bool' | 'date' | 'regex'
}

/**
 * https://docs.mongodb.com/manual/reference/operator/query-comparison/
 */
export type WithEqualityOperator<Field> = {
  $eq?: Field
  $ne?: Field
  $in?: readonly Field[]
  $nin?: readonly Field[]
}

export type WithComparisonOperator<Field> = Field extends
  | number
  | Date
  | ObjectId
  ? {
      $gt?: Field
      $lt?: Field
      $gte?: Field
      $lte?: Field
    }
  : {}

/**
 * https://docs.mongodb.com/manual/reference/operator/query/regex/
 * Does not include $option because it is covered by RegExp
 */
export type WithStringOperator<Field> = Field extends string
  ? {
      $regex?: RegExp | string
      $options?: string
    }
  : {}

/***
 * https://www.mongodb.com/docs/manual/reference/operator/query/text/
 * Text Search functionality
 */
export type WithTextSearchOperator = {
  $text?: {
    $search: string
    $language?: string
    $caseSensitive?: boolean
    $diacriticSensitive?: boolean
  }
}

/**
 * https://docs.mongodb.com/manual/reference/operator/query/all/
 */
export type WithArrayOperator<Field> = Field extends ReadonlyArray<infer T>
  ? {
      $all?: T extends NonArrayObject
        ? (T | { $elemMatch: WithOperator<T> })[]
        : T[]
      $size?: number
    }
  : {}

/**
 * https://docs.mongodb.com/manual/reference/operator/query/not/
 */
export type WithNegatableOperator<Expr> =
  | {
      $not: Expr
    }
  | Expr

export type WithRecordOperator<
  TSchema,
  IndexType extends number = 0
> = TSchema extends NonArrayObject
  ? {
      readonly [Property in FlattenFilterPaths<
        WithId<TSchema>,
        IndexType
      >]?: FilterType<TSchema, Property>
    }
  : {}

export type WithOperator<Field, IndexType extends number = 0> =
  | RecurPartial<Field>
  | WithNegatableOperator<
      WithElementOperator &
        WithRecordOperator<Field, IndexType> &
        WithComparisonOperator<Field> &
        WithStringOperator<Field> &
        WithTextSearchOperator &
        WithEqualityOperator<Field> &
        WithArrayOperator<Field> &
        WithGeoSpatialQueryOperator<Field> &
        WithBitwiseOperator<Field>
    >

/**
 * https://docs.mongodb.com/manual/reference/operator/query-logical/
 */

export type WithLogicalOperators<Field> =
  | Field
  | {
      $and?: readonly WithLogicalOperators<Field>[]
      $or?: readonly WithLogicalOperators<Field>[]
      $nor?: readonly WithLogicalOperators<Field>[]
    }

/**
 * The type for a given dot path into a json object
 * NB: must be maintained as a separate type function
 */
export declare type FilterType<
  TSchema extends Document,
  Property extends string
> = WithLogicalOperators<WithOperator<FlattenFilterType<TSchema, Property>>>

export type TsFilter<
  TSchema extends Document,
  IndexType extends number = 0
> = WithLogicalOperators<WithOperator<TSchema, IndexType>>
