import { Document, OptionalUnlessRequiredId, WithoutId } from 'mongodb'
import { TsRawCollection, TsReadWriteCollection } from './collection'
import { DocumentWithId, TsFilter, TsUpdate } from './types'
import { TsModifyResult } from './types/result'

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

export type MiddlewareMethods = (typeof middlewareMethods)[number]

type Converter<
  TInsertSchema0 extends Document,
  TInsertSchema1 extends Document,
  TUpdateSchema0 extends Document,
  TUpdateSchema1 extends Document,
  TReplaceSchema0 extends Document,
  TReplaceSchema1 extends Document,
  TsFilterSchema extends DocumentWithId,
  TReturnSchema extends DocumentWithId
> = {
  preInsert: (
    obj: OptionalUnlessRequiredId<TInsertSchema1>
  ) => OptionalUnlessRequiredId<TInsertSchema0>
  preUpdate: (_: TsUpdate<TUpdateSchema1>) => TsUpdate<TUpdateSchema0>
  preReplace: (_: WithoutId<TReplaceSchema1>) => WithoutId<TReplaceSchema0>
  postFind: (_: TReturnSchema) => TReturnSchema
  preFilter: (_: TsFilter<TsFilterSchema>) => TsFilter<TsFilterSchema>
}

export const convertRawCollection = <
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
    postFind,
    preFilter,
  }: Converter<
    TInsertSchema0,
    TInsertSchema1,
    TUpdateSchema0,
    TUpdateSchema1,
    TReplaceSchema0,
    TReplaceSchema1,
    TsFilterSchema,
    TReturnSchema
  >
): TsRawCollection<
  TInsertSchema1,
  TUpdateSchema1,
  TReplaceSchema1,
  TsFilterSchema,
  TReturnSchema
> => {
  type InputType = TsRawCollection<
    TInsertSchema0,
    TUpdateSchema0,
    TReplaceSchema0,
    TsFilterSchema,
    TReturnSchema
  >

  type ReturnType = TsRawCollection<
    TInsertSchema1,
    TUpdateSchema1,
    TReplaceSchema1,
    TsFilterSchema,
    TReturnSchema
  >

  const convertModifyResult = ({
    value,
    ...result
  }: TsModifyResult<TReturnSchema>) => ({
    value: value ? postFind(value) : value,
    ...result,
  })

  const proxy = new Proxy<InputType>(collection, {
    get: (target, prop) => {
      const convert = <Prop extends MiddlewareMethods>(
        prop_: Prop,
        converter: (_: InputType[Prop]) => ReturnType[Prop]
      ): ReturnType[Prop] => {
        const oldMethod = target[prop_].bind(target) as (typeof target)[Prop]
        return converter(oldMethod)
      }

      switch (prop) {
        case 'insertOne': {
          return convert(
            prop,
            (oldMethod) => (doc, options) => oldMethod(preInsert(doc), options)
          )
        }
        case 'insertMany': {
          return convert(
            prop,
            (oldMethod) => (docs, options) =>
              oldMethod(docs.map(preInsert), options)
          )
        }
        case 'updateOne': {
          return convert(
            prop,
            (oldMethod) => (filter, update, options) =>
              oldMethod(preFilter(filter), preUpdate(update), options)
          )
        }
        case 'updateMany': {
          return convert(
            prop,
            (oldMethod) => (filter, update, options) =>
              oldMethod(preFilter(filter), preUpdate(update), options)
          )
        }
        case 'replaceOne': {
          return convert(
            prop,
            (oldMethod) => (filter, replacement, options) =>
              oldMethod(preFilter(filter), preReplace(replacement), options)
          )
        }
        case 'findOne': {
          return convert(
            prop,
            (oldMethod) => (filter, options) =>
              oldMethod(preFilter(filter), options).then((result) =>
                result ? postFind(result) : null
              )
          )
        }
        case 'deleteOne': {
          return convert(
            prop,
            (oldMethod) => (filter, options) =>
              oldMethod(preFilter(filter), options)
          )
        }
        case 'deleteMany': {
          return convert(
            prop,
            (oldMethod) => (filter, options) =>
              oldMethod(preFilter(filter), options)
          )
        }
        case 'find': {
          return convert(
            prop,
            (oldMethod) => (filter, options?) =>
              oldMethod(preFilter(filter), options).map(postFind)
          )
        }
        case 'findOneAndDelete': {
          return convert(
            prop,
            (oldMethod) => (filter, options) =>
              oldMethod(preFilter(filter), options).then(convertModifyResult)
          )
        }
        case 'findOneAndReplace': {
          return convert(
            prop,
            (oldMethod) => (filter, replacement, options) =>
              oldMethod(
                preFilter(filter),
                preReplace(replacement),
                options
              ).then(convertModifyResult)
          )
        }
        case 'findOneAndUpdate': {
          return convert(
            prop,
            (oldMethod) => (filter, update, options) =>
              oldMethod(preFilter(filter), preUpdate(update), options).then(
                convertModifyResult
              )
          )
        }
        case 'insert': {
          return convert(
            prop,
            (oldMethod) => (docs, options) =>
              oldMethod(docs.map(preInsert), options)
          )
        }
        case 'update': {
          return convert(
            prop,
            (oldMethod) => (filter, update, options) =>
              oldMethod(preFilter(filter), preUpdate(update), options)
          )
        }
        default: {
          const result = target[prop as keyof typeof target]
          if (result instanceof Function) {
            return result.bind(target)
          }
          return result
        }
      }
    },
  })

  // HACK: proxy is not meant to change the object type but use it to tweak the type
  return proxy as unknown as ReturnType
}

export const convertReadWriteCollection = <
  TWrite0 extends Document,
  TWrite1 extends Document,
  TRead extends DocumentWithId
>(
  collection: TsReadWriteCollection<TWrite0, TRead>,
  converter: Converter<
    TWrite0,
    TWrite1,
    TWrite0,
    TWrite1,
    TWrite0,
    TWrite1,
    TRead,
    TRead
  >
): TsReadWriteCollection<TWrite1, TRead> =>
  convertRawCollection<
    TWrite0,
    TWrite1,
    TWrite0,
    TWrite1,
    TWrite0,
    TWrite1,
    TRead,
    TRead
  >(collection, converter)
