import {
  BulkWriteOptions,
  Db,
  DeleteOptions,
  DeleteResult,
  Document,
  InsertManyResult,
  InsertOneOptions,
  InsertOneResult,
  OptionalUnlessRequiredId,
  UpdateOptions,
  UpdateResult,
  WithId,
} from 'mongodb'
import { z } from 'zod'
import { mkTsCollection, TsCollection } from './collection'
import { DocumentWithId, TsFilter, TsFindCursor, TsFindOptions, TsUpdate } from './types'

export type WithTime<T extends Document> = T & {
  createdAt: Date
  updatedAt: Date
}

export type DocumentWithIdTime = DocumentWithId & {
  createdAt: Date
  updatedAt: Date
}

export class ZodCollection<TSchema extends Document> {
  public collection: TsCollection<WithTime<TSchema>>

  constructor(public db: Db, public collectionName: string, public schema: z.ZodType<TSchema>) {
    this.collection = mkTsCollection<WithTime<TSchema>>(db, collectionName)
  }

  insertTimestamp(
    x: OptionalUnlessRequiredId<TSchema>
  ): OptionalUnlessRequiredId<WithTime<TSchema>> {
    const date = new Date()
    return { ...x, createdAt: date, updatedAt: date } as any
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
  findOne<T extends DocumentWithIdTime = WithTime<WithId<TSchema>>>(
    filter: TsFilter<WithTime<TSchema>>,
    options?: TsFindOptions<WithTime<TSchema>>
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
  find<T extends DocumentWithIdTime = WithTime<WithId<TSchema>>>(
    filter: TsFilter<WithTime<TSchema>>,
    options?: TsFindOptions<WithTime<TSchema>>
  ): TsFindCursor<T> {
    if (!options) {
      return this.collection.find<T>(filter)
    }
    return this.collection.find<T>(filter, options)
  }

  updateTimestamp(update: TsUpdate<TSchema>): TsUpdate<WithTime<TSchema>> {
    const date = new Date()
    return {
      ...update,
      $setOnInsert: { ...update.$setOnInsert, createdAt: date },
      $set: { ...update.$set, updatedAt: date },
    } as any
  }

  /**
   * Update a single document in a collection
   *
   * @param filter - The filter used to select the document to update
   * @param update - The update operations to be applied to the document
   * @param options - Optional settings for the command
   */
  updateOne(
    filter: TsFilter<WithTime<TSchema>>,
    update: TsUpdate<TSchema>,
    options?: UpdateOptions
  ): Promise<UpdateResult> {
    return this.collection.updateOne(filter, this.updateTimestamp(update), options)
  }

  /**
   * Update multiple documents in a collection
   *
   * @param filter - The filter used to select the documents to update
   * @param update - The update operations to be applied to the documents
   * @param options - Optional settings for the command
   */
  updateMany(
    filter: TsFilter<WithTime<TSchema>>,
    update: TsUpdate<TSchema>,
    options?: UpdateOptions
  ): Promise<UpdateResult | Document> {
    return this.collection.updateMany(filter, this.updateTimestamp(update), options)
  }

  /**
   * Delete a document from a collection
   *
   * @param filter - The filter used to select the document to remove
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  deleteOne(filter: TsFilter<WithTime<TSchema>>, options?: DeleteOptions): Promise<DeleteResult> {
    return this.collection.deleteOne(filter, options)
  }
  /**
   * Delete multiple documents from a collection
   *
   * @param filter - The filter used to select the documents to remove
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  deleteMany(filter: TsFilter<WithTime<TSchema>>, options?: DeleteOptions): Promise<DeleteResult> {
    return this.collection.deleteMany(filter, options)
  }
}
