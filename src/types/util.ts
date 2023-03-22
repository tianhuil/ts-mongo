import { Document, ObjectId } from 'mongodb'

export declare type DocumentWithId = Document & { _id: ObjectId }

export declare type OptionalId<TSchema extends DocumentWithId> = Omit<
  TSchema,
  '_id'
> &
  Partial<Pick<TSchema, '_id'>>

export declare type BaseTypes =
  | null
  | string
  | number
  | boolean
  | Date
  | RegExp
  | Buffer
  | Uint8Array
  | ObjectId
  | { _bsontype: string }

export declare type Doc = { [x in string]: _Doc }
export declare type _Doc = BaseTypes | _Doc[] | { [x in string]: _Doc }

export declare type RecurPartial<T> = T extends BaseTypes
  ? T
  : T extends ReadonlyArray<infer ArrayType>
  ? ReadonlyArray<RecurPartial<ArrayType>>
  : T extends Record<string, unknown>
  ? { readonly [P in keyof T]?: RecurPartial<T[P]> }
  : never

/**
 * Array extends Document so need a document that does not match an Array
 * However, must also extend Document for `TSchema[Property]` to be valid
 */
export declare type NonArrayObject = {
  readonly [x: string]: unknown
  readonly [y: number]: never
}

export declare type RemodelType<NewType, OldType> = NewType &
  Omit<OldType, keyof NewType>

export declare type NonNeverKeys<TSchema extends NonArrayObject> = {
  [Key in keyof TSchema]: TSchema[Key] extends never ? never : Key
}[keyof TSchema]

export declare type RecurRemoveNever<TSchema> = TSchema extends BaseTypes
  ? TSchema
  : TSchema extends NonArrayObject
  ? { [Key in NonNeverKeys<TSchema>]: RecurRemoveNever<TSchema[Key]> }
  : TSchema extends ReadonlyArray<infer ArrayType>
  ? Array<RecurRemoveNever<ArrayType>>
  : never

/**
 * Allow only one of the keys in `Keys` to be present in `T`
 */
export type AllowOnlyOne<T, Keys extends keyof T = keyof T> = Omit<T, Keys> &
  {
    [K in keyof T]: Pick<T, K> & Partial<Record<Exclude<Keys, K>, never>>
  }[Keys]
