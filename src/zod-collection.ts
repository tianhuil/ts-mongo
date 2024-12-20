import { TsReadWriteCollection } from './collection'
import z from 'zod'
import { convertReadWriteCollection } from './converter'
import { OptionalUnlessRequiredId, WithId, Document } from 'mongodb'
import { WithTime } from './time-collection'
import { parseFieldsAsArrays, zodDeepPartial } from './zod-utils'

type WithIdTime<T> = WithId<WithTime<T>>

/**
 * Create a collection that uses zod to validate inserted data and
 * Mongo operators at runtime
 * @param collection
 * @param schema
 */
export const convertToZodCollection = <TSchema extends Document>(
  collection: TsReadWriteCollection<TSchema, WithIdTime<TSchema>>,
  schema: z.ZodType<TSchema>
): TsReadWriteCollection<TSchema, WithIdTime<TSchema>> =>
  convertReadWriteCollection(collection, {
    preInsert: (
      obj: OptionalUnlessRequiredId<TSchema>
    ): OptionalUnlessRequiredId<TSchema> => {
      const schemaWithId = schema.and(
        z.object({
          _id: z
            // Can't be instanceof(ObjectId) because the instanceof operator
            // doesn't work correctly when ts-mongo is imported by another lib
            // This is similar to what we do with zod instance checking here:
            // https://github.com/cau777/zod/blob/ee7f929f6b145721e5f79ad8ba7a2357d32053f6/src/types.ts#L206-L226
            .instanceof(Object)
            .refine((obj) => obj.constructor.name === 'ObjectId')
            .optional(),
        })
      )
      return schemaWithId.parse(obj) as OptionalUnlessRequiredId<TSchema>
    },
    preUpdate: (obj) => {
      const partialSchema = zodDeepPartial(schema)
      return {
        ...obj,
        // TODO: validate other operators
        ...(obj.$pull
          ? { $pull: parseFieldsAsArrays(obj.$pull, partialSchema) }
          : {}),
        ...(obj.$push
          ? { $push: parseFieldsAsArrays(obj.$push, partialSchema) }
          : {}),
        ...(obj.$addToSet
          ? { $addToSet: parseFieldsAsArrays(obj.$addToSet, partialSchema) }
          : {}),
        ...(obj.$set ? { $set: partialSchema.parse(obj.$set) } : {}),
        ...(obj.$setOnInsert
          ? { $setOnInsert: partialSchema.parse(obj.$setOnInsert) }
          : {}),
      }
    },
    preReplace: (obj) => schema.parse(obj),
    postFind: (obj) => obj,
    preFilter: (obj) => obj,
  })
