import { Document, OptionalUnlessRequiredId, WithId, WithoutId } from 'mongodb'
import { z } from 'zod'
import { TsRawCollection, TsReadWriteCollection } from './collection'
import { type MiddlewareMethods } from './middleware'
import { DocumentWithId, TsFilter, TsUpdate } from './types'
import { TsModifyResult } from './types/result'

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

export const convertToZodCollection = <TSchema extends Document>(
  collection: TsReadWriteCollection<TSchema, WithId<TSchema>>,
  schema: z.ZodType<TSchema>,
  silentError: boolean = false
): TsReadWriteCollection<TSchema, WithId<TSchema>> => {
  const handleInsertOrReplace = <T extends WithoutId<TSchema>>(obj: T) => {
    if (silentError) {
      const result = schema.safeParse(obj)
      if (result.success)
        return result.data as OptionalUnlessRequiredId<TSchema>
      else return obj
    } else {
      return schema.parse(obj) as OptionalUnlessRequiredId<TSchema>
    }
  }
  return convertReadWriteCollection(collection, {
    preInsert: (obj) => handleInsertOrReplace(obj),
    preUpdate: (obj) => {
      const parsedObj: TsUpdate<TSchema> = {}
      const typeSafeUpdateOperators = ['$set', '$inc', '$min', '$max'] as const

      /**
       * Note: The goal was to make all the fields in the schema optional,
       * since the caller must be able to update a subset of the fields/keys
       * in the schema.
       */
      const updateSchema = schema.optional()

      for (const key of typeSafeUpdateOperators) {
        if (silentError) {
          const result = updateSchema.safeParse(obj[key])
          if (result.success) {
            parsedObj[key] = result.data
          } else {
            parsedObj[key] = obj[key] as any
          }
        } else {
          parsedObj[key] = updateSchema.parse(obj[key])
        }
      }
      return parsedObj
    },
    preReplace: (obj) => handleInsertOrReplace(obj),
    postFind: (obj) => obj,
    preFilter: (obj) => obj,
  })
}
