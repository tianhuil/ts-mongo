import { Collection, CollectionOptions, Db } from 'mongodb'
import { RemodelType, SafeCollection } from './types'

export declare type TsCollection<TSchema> = RemodelType<
  SafeCollection<TSchema> & { unsafe: Collection<TSchema> },
  Collection<TSchema>
>

/**
 *
 * @param db mongodb
 * @param name name of collection
 * @param options collection
 * @returns
 */
export const mkTsCollection = <TSchema>(
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
