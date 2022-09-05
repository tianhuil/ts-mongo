import { WithId } from 'mongodb'
import { BaseTypes, NonArrayObject } from './util'

export declare type FlattenFilterPaths<
  Type,
  IndexType extends number = 0
> = Join<NestedPaths<WithId<Type>, IndexType>, '.'>

// Do not allow numeric index because that weakens type-checking
// (the resulting template literal does not check for extra keys)
type UpdateArrayHolder = '$' | '$[]'

export declare type FlattenUpdatePaths<Type> = Join<
  NestedPaths<WithId<Type>, UpdateArrayHolder>,
  '.'
>

export declare type FlattenFilterType<
  TSchema,
  Property extends string
> = _FlattenFilterType<WithId<TSchema>, Property, `${number}`>

export declare type FlattenUpdateType<
  TSchema,
  Property extends string
> = _FlattenFilterType<WithId<TSchema>, Property, UpdateArrayHolder>

declare type Join<T extends unknown[], D extends string> = T extends []
  ? ''
  : T extends [string | number]
  ? `${T[0]}`
  : T extends [string | number, ...infer R]
  ? `${T[0]}${D}${Join<R, D>}`
  : string

declare type NestedPaths<Type, ArrayIndexType> = Type extends BaseTypes
  ? []
  : Type extends ReadonlyArray<infer ArrayType>
  ? ArrayType extends NonArrayObject
    ? // Can omit index for array of objects
      // https://docs.mongodb.com/manual/tutorial/query-array-of-documents/#combination-of-elements-satisfies-the-criteria
      | NestedPaths<ArrayType, ArrayIndexType>
        | [ArrayIndexType, ...NestedPaths<ArrayType, ArrayIndexType>]
        | [ArrayIndexType] // Can stop at array
    :
        | [ArrayIndexType, ...NestedPaths<ArrayType, ArrayIndexType>]
        | [ArrayIndexType] // Can stop at array
  : Type extends Map<string, unknown>
  ? [string]
  : Type extends object
  ? {
      [Key in Extract<keyof Type, string>]:
        | [Key, ...NestedPaths<Type[Key], ArrayIndexType>]
        | [Key]
    }[Extract<keyof Type, string>]
  : []

declare type _FlattenFilterType<
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
      ? _FlattenFilterType<ArrayType, Rest, ArrayHolder>
      : never
    : Key extends keyof TSchema
    ? _FlattenFilterType<TSchema[Key], Rest, ArrayHolder>
    : never
  : TSchema extends ReadonlyArray<infer ArrayType> // Can omit index for array of objects
  ? ArrayType extends NonArrayObject
    ? _FlattenFilterType<ArrayType, Property, ArrayHolder>
    : never
  : never
