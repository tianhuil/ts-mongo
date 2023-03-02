import { WithId } from 'mongodb'
import { BaseTypes, NonArrayObject } from './util'

export declare type FlattenFilterPaths<
  Type,
  IndexType extends number = 0
> = Join<FlattenPaths<WithId<Type>, IndexType>, '.'>

// Do not allow numeric index because that weakens type-checking
// (the resulting template literal does not check for extra keys)
type UpdateArrayHolder = '$' | '$[]'

type ProjectionArrayHolder = '$'

export declare type FlattenUpdatePaths<Type> = Join<
  FlattenPaths<WithId<Type>, UpdateArrayHolder>,
  '.'
>

export declare type FlattenProjectionPaths<Type> = Join<
  FlattenPaths<WithId<Type>, ProjectionArrayHolder>,
  '.'
>

export declare type FlattenFilterType<
  TSchema,
  Property extends string
> = FlattenType<WithId<TSchema>, Property, `${number}`>

export declare type FlattenUpdateType<
  TSchema,
  Property extends string
> = FlattenType<WithId<TSchema>, Property, UpdateArrayHolder>

export declare type FlattenProjectionType<
  TSchema,
  Property extends string
> = FlattenType<WithId<TSchema>, Property, ProjectionArrayHolder>

export declare type FlattenSortType<
  TSchema,
  Property extends string
> = FlattenType<WithId<TSchema>, Property, never>

declare type Join<T extends unknown[], D extends string> = T extends []
  ? ''
  : T extends [string | number]
  ? `${T[0]}`
  : T extends [string | number, ...infer R]
  ? `${T[0]}${D}${Join<R, D>}`
  : string

/**
 * "dot path" of Type
 */
declare type FlattenPaths<Type, ArrayIndexType> = Type extends BaseTypes
  ? []
  : Type extends ReadonlyArray<infer ArrayType>
  ? ArrayType extends NonArrayObject
    ? // Can omit index for array of objects
      // https://docs.mongodb.com/manual/tutorial/query-array-of-documents/#combination-of-elements-satisfies-the-criteria
      | FlattenPaths<ArrayType, ArrayIndexType>
        | [ArrayIndexType, ...FlattenPaths<ArrayType, ArrayIndexType>]
        | [ArrayIndexType] // Can stop at array
    :
        | [ArrayIndexType, ...FlattenPaths<ArrayType, ArrayIndexType>]
        | [ArrayIndexType] // Can stop at array
  : Type extends Map<string, unknown>
  ? [string]
  : Type extends object
  ? {
      [Key in Extract<keyof Type, string>]:
        | [Key, ...FlattenPaths<Type[Key], ArrayIndexType>]
        | [Key]
    }[Extract<keyof Type, string>]
  : []

/**
 * Given a "dot path" Property, give TSchema's corresponding type
 */
declare type FlattenType<
  TSchema,
  Property extends string,
  ArrayHolder extends string
> = string extends Property
  ? never
  : TSchema extends BaseTypes
  ? TSchema
  : Property extends keyof TSchema // Simple key
  ? TSchema extends NonArrayObject
    ? TSchema[Property]
    : never
  : Property extends ArrayHolder
  ? TSchema extends ReadonlyArray<infer ArrayType>
    ? ArrayType
    : never
  : Property extends `${infer Key}.${infer Rest}` // Compound key
  ? Key extends ArrayHolder
    ? TSchema extends ReadonlyArray<infer ArrayType>
      ? FlattenType<ArrayType, Rest, ArrayHolder>
      : never
    : Key extends keyof TSchema
    ? FlattenType<TSchema[Key], Rest, ArrayHolder>
    : never
  : TSchema extends ReadonlyArray<infer ArrayType> // Can omit index for array of objects
  ? ArrayType extends NonArrayObject
    ? FlattenType<ArrayType, Property, ArrayHolder>
    : never
  : never
