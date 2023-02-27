import { WithOperator } from './filter'
import { FlattenProjectionPaths, FlattenProjectionType } from './flatten'
import { Doc } from './util'

export declare type TsProjection<TSchema extends Doc> = _Projection<TSchema>

/**
 * _Projection is a stub entry that tricks the type system into allowing `TSchema extends Doc`
 */
declare type _Projection<TSchema> =
  | {
      [Property in FlattenProjectionPaths<TSchema>]?: Property extends '_id'
        ? 1 | 0 | boolean
        : PositiveProjectionFlattenTypes<TSchema, Property>
    }
  | { [Property in FlattenProjectionPaths<TSchema>]?: 0 | false }

type PositiveProjectionFlattenTypes<
  TSchema,
  Property extends string
> = FlattenProjectionType<TSchema, Property> extends ReadonlyArray<
  infer ArrayType
>
  ?
      | {
          $elemMatch?: WithOperator<ArrayType>
          $slice?: number | [number, number]
        }
      | 1
      | true
  : 1 | true // not array
