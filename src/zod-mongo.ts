import {
  BulkWriteOptions,
  CountDocumentsOptions,
  Db,
  DeleteOptions,
  DeleteResult,
  Document,
  EstimatedDocumentCountOptions,
  InsertManyResult,
  InsertOneOptions,
  InsertOneResult,
  ModifyResult,
  OptionalUnlessRequiredId,
  UpdateOptions,
  UpdateResult,
  WithId,
} from 'mongodb'
import { z } from 'zod'
import { mkTsCollection, TsCollection } from './collection'
import {
  DocumentWithId,
  TsFilter,
  TsFindCursor,
  TsFindOneAndDeleteOptions,
  TsFindOneAndUpdateOptions,
  TsFindOptions,
  TsUpdate,
} from './types'

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

  /**
   * Find a document and delete it in one atomic operation. Requires a write lock for the duration of the operation.
   *
   * @param filter - The filter used to select the document to remove
   * @param options - Optional settings for the command
   */
  findOneAndDelete(
    filter: TsFilter<WithTime<TSchema>>,
    options?: TsFindOneAndDeleteOptions<WithTime<TSchema>>
  ): Promise<ModifyResult<WithTime<TSchema>>> {
    return this.collection.findOneAndDelete(filter, options)
  }

  /**
   * Find a document and update it in one atomic operation. Requires a write lock for the duration of the operation.
   *
   * @param filter - The filter used to select the document to update
   * @param update - Update operations to be performed on the document
   * @param options - Optional settings for the command
   */
  findOneAndUpdate(
    filter: TsFilter<WithTime<TSchema>>,
    update: TsUpdate<WithTime<TSchema>>,
    options?: TsFindOneAndUpdateOptions<WithTime<TSchema>>
  ): Promise<ModifyResult<WithTime<TSchema>>> {
    return this.collection.findOneAndUpdate(filter, update, options)
  }

  /**
   * Gets an estimate of the count of documents in a collection using collection metadata.
   * This will always run a count command on all server versions.
   *
   * due to an oversight in versions 5.0.0-5.0.8 of MongoDB, the count command,
   * which estimatedDocumentCount uses in its implementation, was not included in v1 of
   * the Stable API, and so users of the Stable API with estimatedDocumentCount are
   * recommended to upgrade their server version to 5.0.9+ or set apiStrict: false to avoid
   * encountering errors.
   *
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   */
  estimatedDocumentCount(options?: EstimatedDocumentCountOptions): Promise<number> {
    return this.collection.estimatedDocumentCount(options)
  }
  /**
   * Gets the number of documents matching the filter.
   * For a fast count of the total documents in a collection see {@link Collection#estimatedDocumentCount| estimatedDocumentCount}.
   * **Note**: When migrating from {@link Collection#count| count} to {@link Collection#countDocuments| countDocuments}
   * the following query operators must be replaced:
   *
   * | Operator | Replacement |
   * | -------- | ----------- |
   * | `$where`   | [`$expr`][1] |
   * | `$near`    | [`$geoWithin`][2] with [`$center`][3] |
   * | `$nearSphere` | [`$geoWithin`][2] with [`$centerSphere`][4] |
   *
   * [1]: https://docs.mongodb.com/manual/reference/operator/query/expr/
   * [2]: https://docs.mongodb.com/manual/reference/operator/query/geoWithin/
   * [3]: https://docs.mongodb.com/manual/reference/operator/query/center/#op._S_center
   * [4]: https://docs.mongodb.com/manual/reference/operator/query/centerSphere/#op._S_centerSphere
   *
   * @param filter - The filter for the count
   * @param options - Optional settings for the command
   * @param callback - An optional callback, a Promise will be returned if none is provided
   *
   * @see https://docs.mongodb.com/manual/reference/operator/query/expr/
   * @see https://docs.mongodb.com/manual/reference/operator/query/geoWithin/
   * @see https://docs.mongodb.com/manual/reference/operator/query/center/#op._S_center
   * @see https://docs.mongodb.com/manual/reference/operator/query/centerSphere/#op._S_centerSphere
   */
  countDocuments(
    filter: TsFilter<WithTime<TSchema>>,
    options?: CountDocumentsOptions
  ): Promise<number> {
    return this.collection.countDocuments(filter, options)
  }
}
