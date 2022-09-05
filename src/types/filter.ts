import { Document, WithId } from 'mongodb'
import { FlattenFilterPaths, FlattenFilterType } from './flatten'
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
export type WithComparisonOperator<Field> = {
  $eq?: Field
  $ne?: Field
  $in?: readonly Field[]
  $nin?: readonly Field[]
}

export type WithNumericOperator<Field> = Field extends number
  ? {
      $gt?: number
      $lt?: number
      $gte?: number
      $lte?: number
    }
  : {}

/**
 * https://docs.mongodb.com/manual/reference/operator/query/regex/
 * Does not include $option because it is covered by RegExp
 */
export type WithStringOperator<Field> = Field extends string
  ? {
      $regex?: RegExp | string
      $text?: {
        $search: string
        $language?: string
        $caseSensitive?: boolean
        $diacriticSensitive?: boolean
      }
    }
  : {}

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
        WithNumericOperator<Field> &
        WithArrayOperator<Field>
    >

/**
 * https://docs.mongodb.com/manual/reference/operator/query-logical/
 */
export type WithLogicalOperators<Field> =
  | Field
  | {
      $and?: readonly Field[]
      $or?: readonly Field[]
      $nor?: readonly Field[]
    }

/**
 * The type for a given dot path into a json object
 * NB: must be maintained as a separate type function
 */
export declare type FilterType<
  TSchema extends Document,
  Property extends string
> = WithOperator<FlattenFilterType<TSchema, Property>>

export type Filter<
  TSchema extends Document,
  IndexType extends number = 0
> = WithLogicalOperators<WithOperator<TSchema, IndexType>>
