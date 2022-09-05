import { Document, Timestamp } from 'mongodb'
import { WithOperator } from './filter'
import {
  FlattenFilterPaths,
  FlattenFilterType,
  FlattenUpdatePaths,
  FlattenUpdateType,
} from './flatten'
import { Sort } from './sort'

export declare type Update<TSchema extends Document> = {
  // General operators
  $set?: UpdateFlattenTypes<TSchema, unknown>
  $setOnInsert?: UpdateFlattenTypes<TSchema, unknown>
  $unset?: UpdateFlattenTypes<TSchema, unknown, '' | true | 1>

  // Comparison operators
  $inc?: UpdateFlattenTypes<TSchema, number>
  $mul?: UpdateFlattenTypes<TSchema, number>
  $max?: UpdateFlattenTypes<TSchema, number | Date | Timestamp>
  $min?: UpdateFlattenTypes<TSchema, number | Date | Timestamp>
  $currentDate?: UpdateFlattenTypes<
    TSchema,
    Date | Timestamp,
    true | { $type: 'timestamp' | 'date' }
  >

  // Add array operators
  $push?: UpdateFlattenArrayTypes<TSchema>
  $addToSet?: UpdateFlattenArrayTypes<TSchema> // https://docs.mongodb.com/manual/reference/operator/update/addToSet/

  // Remove array elements
  $pull?: PullTypes<TSchema>
  $pullAll?: PullAllTypes<TSchema>
  $pop?: UpdateFlattenArrayTypes<TSchema, -1 | 1>
}

// Select for UpdatePaths
export declare type SelectFlattenUpdatePaths<
  TSchema extends Document,
  KeepType
> = {
  readonly [Property in FlattenUpdatePaths<TSchema>]: FlattenUpdateType<
    TSchema,
    Property
  > extends KeepType
    ? Property
    : never
}[FlattenUpdatePaths<TSchema>]

export declare type UpdateFlattenTypes<
  TSchema,
  KeepType,
  AssignType = unknown
> = {
  readonly [Property in SelectFlattenUpdatePaths<
    TSchema,
    KeepType
  >]?: FlattenUpdateType<TSchema, Property> extends KeepType
    ? unknown extends AssignType
      ? FlattenUpdateType<TSchema, Property>
      : AssignType
    : never
}

// Update Array types using Filter dot notation
export declare type SelectFlattenFilterPaths<
  TSchema extends Document,
  KeepType
> = {
  readonly [Property in FlattenFilterPaths<TSchema>]: FlattenFilterType<
    TSchema,
    Property
  > extends KeepType
    ? Property
    : never
}[FlattenFilterPaths<TSchema>]

export declare type PullTypes<TSchema extends Document> = {
  readonly [Property in SelectFlattenFilterPaths<
    TSchema,
    Array<unknown>
  >]?: FlattenFilterType<TSchema, Property> extends Array<infer ArrayType>
    ? WithOperator<ArrayType>
    : never
}

export declare type PullAllTypes<TSchema extends Document> = {
  readonly [Property in SelectFlattenFilterPaths<
    TSchema,
    Array<unknown>
  >]?: FlattenFilterType<TSchema, Property> extends Array<unknown>
    ? FlattenFilterType<TSchema, Property>
    : never
}

// Update Array types using Update dot notation
export declare type UpdateFlattenArrayTypes<
  TSchema extends Document,
  AssignType = unknown
> = {
  readonly [Property in SelectFlattenUpdatePaths<
    TSchema,
    Array<unknown>
  >]?: FlattenUpdateType<TSchema, Property> extends Array<infer ArrayType>
    ? unknown extends AssignType
      ? ArrayAssignType<ArrayType>
      : AssignType
    : never
}

export declare type ArrayAssignType<T> =
  | T
  | {
      $each: ReadonlyArray<T>
      $position?: number
      $slice?: number
      $sort?: Sort<T>
    }
