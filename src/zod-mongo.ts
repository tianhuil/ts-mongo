import {
  BulkWriteOptions,
  Document,
  InsertManyResult,
  InsertOneOptions,
  InsertOneResult,
  MongoClient,
  OptionalUnlessRequiredId,
  WithId,
} from 'mongodb'
import { z } from 'zod'
import { mkTsCollection, TsCollection } from './collection'
import { DocumentWithId, TsFilter, TsFindCursor, TsFindOptions } from './types'

export type WithTime<T extends Document> = T & {
  createdAt: Date
  updatedAt: Date
}

export class ZodCollection<TSchema extends Document> {
  public collection: TsCollection<TSchema>

  constructor(
    public client: MongoClient,
    public dbName: string,
    public collectionName: string,
    public schema: z.ZodType<TSchema>
  ) {
    this.collection = mkTsCollection<TSchema>(client.db(dbName), collectionName)
  }

  insertTimestamp(
    x: OptionalUnlessRequiredId<TSchema>
  ): WithTime<OptionalUnlessRequiredId<TSchema>> {
    const date = new Date()
    return { ...x, createdAt: date, updatedAt: date }
  }

  /**
   * Inserts a single document into MongoDB. If documents passed in do not contain the **_id** field,
   * one will be added to each of the documents missing it by the driver, mutating the document. This behavior
   * can be overridden by setting the **forceServerObjectId** flag.
   *
   * @param doc - The document to insert
   * @param options - Optional settings for the command
   */
  insertOne(
    doc: OptionalUnlessRequiredId<TSchema>,
    options?: InsertOneOptions
  ): Promise<InsertOneResult<TSchema>> {
    if (!options) {
      return this.collection.insertOne(this.insertTimestamp(doc))
    }
    return this.collection.insertOne(this.insertTimestamp(doc), options)
  }

  /**
   * Inserts an array of documents into MongoDB. If documents passed in do not contain the **_id** field,
   * one will be added to each of the documents missing it by the driver, mutating the document. This behavior
   * can be overridden by setting the **forceServerObjectId** flag.
   *
   * @param docs - The documents to insert
   * @param options - Optional settings for the command
   */
  insertMany(
    docs: OptionalUnlessRequiredId<TSchema>[],
    options?: BulkWriteOptions
  ): Promise<InsertManyResult<TSchema>> {
    if (!options) {
      return this.collection.insertMany(docs.map((doc) => this.insertTimestamp(doc)))
    }
    return this.collection.insertMany(
      docs.map((doc) => this.insertTimestamp(doc)),
      options
    )
  }

  /**
   * Fetches the first document that matches the filter
   *
   * @param filter - Query for find Operation
   * @param options - Optional settings for the command
   */
  findOne<T extends DocumentWithId = WithId<TSchema>>(
    filter: TsFilter<TSchema>,
    options?: TsFindOptions<TSchema>
  ): Promise<T | null> {
    if (!options) {
      return this.collection.findOne<T>(filter)
    }
    return this.collection.findOne<T>(filter, options)
  }

  /**
   * Creates a cursor for a filter that can be used to iterate over results from MongoDB
   *
   * @param filter - The filter predicate. If unspecified, then all documents in the collection will match the predicate
   */
  find<T extends DocumentWithId = WithId<TSchema>>(
    filter: TsFilter<TSchema>,
    options?: TsFindOptions<TSchema>
  ): TsFindCursor<T> {
    if (!options) {
      return this.collection.find<T>(filter)
    }
    return this.collection.find<T>(filter, options)
  }
}
