import { WithOperator } from './filter'
import { FlattenFilterPaths, FlattenFilterType } from './flatten'
import { Doc } from './util'

export declare type ProjectionOperator<Field> = Field extends ReadonlyArray<
  infer ArrayType
>
  ? {
      $elemMatch: WithOperator<ArrayType>
      $slice?: number | [number, number]
    }
  : never

export declare type Projection<TSchema extends Doc> = _Projection<TSchema>

/**
 * _Projection is a stub entry that tricks the type system into allowing `TSchema extends Doc`
 */
export declare type _Projection<TSchema> =
  | {
      [Property in FlattenFilterPaths<TSchema>]?: Property extends '_id'
        ? 1 | 0 | boolean
        : ProjectionOperator<FlattenFilterType<TSchema, Property>> | 1 | true
    }
  | { [Property in FlattenFilterPaths<TSchema>]?: 0 | false }
