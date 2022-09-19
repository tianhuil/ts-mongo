import { Document, OptionalUnlessRequiredId, WithoutId } from 'mongodb'
import { TsRawCollection } from './collection'
import { DocumentWithId, TsUpdate } from './types'

export const middlewareMethods = [
  // Database operations
  'insertOne',
  'insertMany',
  'bulkWrite',
  'updateOne',
  'replaceOne',
  'updateMany',
  'deleteOne',
  'deleteMany',
  'rename',
  'drop',
  'findOne',
  'find',
  'estimatedDocumentCount',
  'countDocuments',
  'distinct',
  'findOneAndDelete',
  'findOneAndReplace',
  'findOneAndUpdate',
  'aggregate',
  'watch',
  'mapReduce',
  'initializeUnorderedBulkOp',
  'initializeOrderedBulkOp',
  'insert',
  'update',
  'remove',
  'count',

  // house-keeping operations
  'createIndex',
  'createIndexes',
  'dropIndex',
  'dropIndexes',
  'listIndexes',
  'indexExists',
  'indexInformation',
  'indexes',
  'stats',
] as const

export type MiddlewareMethods = typeof middlewareMethods[number]

type Converter<
  TInsertSchema0 extends Document,
  TInsertSchema1 extends Document,
  TUpdateSchema0 extends Document,
  TUpdateSchema1 extends Document,
  TReplaceSchema0 extends Document,
  TReplaceSchema1 extends Document,
  TReturnSchema extends DocumentWithId
> = {
  preInsert: (
    obj: OptionalUnlessRequiredId<TInsertSchema1>
  ) => OptionalUnlessRequiredId<TInsertSchema0>
  preUpdate: (obj: TsUpdate<TUpdateSchema1>) => TsUpdate<TUpdateSchema0>
  preReplace: (obj: WithoutId<TReplaceSchema1>) => WithoutId<TReplaceSchema0>
  postFind: (obj: TReturnSchema) => TReturnSchema
}

export const mkConvertedCollection = <
  TInsertSchema0 extends Document,
  TInsertSchema1 extends Document,
  TUpdateSchema0 extends Document,
  TUpdateSchema1 extends Document,
  TReplaceSchema0 extends Document,
  TReplaceSchema1 extends Document,
  TsFilterSchema extends DocumentWithId,
  TReturnSchema extends DocumentWithId
>(
  collection: TsRawCollection<
    TInsertSchema0,
    TUpdateSchema0,
    TReplaceSchema0,
    TsFilterSchema,
    TReturnSchema
  >,
  {
    preInsert,
    preUpdate,
    preReplace,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    postFind,
  }: Converter<
    TInsertSchema0,
    TInsertSchema1,
    TUpdateSchema0,
    TUpdateSchema1,
    TReplaceSchema0,
    TReplaceSchema1,
    TReturnSchema
  >
): TsRawCollection<
  TInsertSchema1,
  TUpdateSchema1,
  TReplaceSchema1,
  TsFilterSchema,
  TReturnSchema
> => {
  type ReturnType = TsRawCollection<
    TInsertSchema1,
    TUpdateSchema1,
    TReplaceSchema1,
    TsFilterSchema,
    TReturnSchema
  >

  return new Proxy(collection, {
    get: (target, prop) => {
      switch (prop) {
        case 'insertOne': {
          const oldMethod = target[prop]
          const newMethod: ReturnType['insertOne'] = (doc, options) =>
            oldMethod(preInsert(doc), options)
          return newMethod
        }
        case 'insertMany': {
          const oldMethod = target[prop]
          const newMethod: ReturnType['insertMany'] = (docs, options) =>
            oldMethod(docs.map(preInsert), options)
          return newMethod
        }
        case 'updateOne': {
          const oldMethod = target[prop]
          const newMethod: ReturnType['updateOne'] = (filter, update, options) =>
            oldMethod(filter, preUpdate(update), options)
          return newMethod
        }
        case 'updateMany': {
          const oldMethod = target[prop]
          const newMethod: ReturnType['updateMany'] = (filter, update, options) =>
            oldMethod(filter, preUpdate(update), options)
          return newMethod
        }
        case 'replaceOne': {
          const oldMethod = target[prop]
          const newMethod: ReturnType['replaceOne'] = (filter, replacement, options) =>
            oldMethod(filter, preReplace(replacement), options)
          return newMethod
        }
        case 'findOneAndReplace': {
          const oldMethod = target[prop]
          const newMethod: ReturnType['findOneAndReplace'] = (filter, replacement, options) =>
            oldMethod(filter, preReplace(replacement), options)
          return newMethod
        }
        case 'findOneAndUpdate': {
          const oldMethod = target[prop]
          const newMethod: ReturnType['findOneAndUpdate'] = (filter, update, options) =>
            oldMethod(filter, preUpdate(update), options)
          return newMethod
        }
        case 'insert': {
          const oldMethod = target[prop]
          const newMethod: ReturnType['insert'] = (docs, options) =>
            oldMethod(docs.map(preInsert), options)
          return newMethod
        }
        case 'update': {
          const oldMethod = target[prop]
          const newMethod: ReturnType['update'] = (filter, update, options) =>
            oldMethod(filter, preUpdate(update), options)
          return newMethod
        }
        // Perhaps add deleteOne, deleteMany, findOne, find, findOneAndDelete?
        default:
          return target[prop as keyof typeof target]
      }
    },
  }) as any
}
