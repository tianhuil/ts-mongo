import { Collection, CollectionOptions, Db, Document, WithId } from 'mongodb'
import { DocumentWithId, RemodelType, SafeCollection } from './types'

export declare type TsRawCollection<
  TInsertSchema extends Document,
  TUpdateSchema extends Document,
  TReplaceSchema extends Document,
  TFilterSchema extends DocumentWithId,
  TReturnSchema extends DocumentWithId
> = RemodelType<
  SafeCollection<
    TInsertSchema,
    TUpdateSchema,
    TReplaceSchema,
    TFilterSchema,
    TReturnSchema
  > & {
    unsafe: Collection<TReturnSchema>
  },
  Collection<TReturnSchema>
>

/**
 * A collection with separate read and write types
 */
export declare type TsReadWriteCollection<
  TWrite extends Document,
  TRead extends DocumentWithId
> = TsRawCollection<TWrite, TWrite, TWrite, TRead, TRead>

/**
 * A simple collection supports filter and return values with id and insert, update, and replace operations without.
 */
export declare type TsCollection<TSchema extends Document> =
  TsReadWriteCollection<TSchema, WithId<TSchema>>

/**
 * Creates a type-safe collection
 * @param db mongodb
 * @param name name of collection
 * @param options collection
 * @returns
 */
export const mkTsCollection = <TSchema extends Document>(
  db: Db,
  name: string,
  options?: CollectionOptions
) => {
  const collection = db.collection<TSchema>(name, options)

  Object.defineProperty(collection, 'unsafe', {
    value: collection,
    configurable: false,
    writable: false,
  })

  return collection as unknown as TsCollection<TSchema>
}
