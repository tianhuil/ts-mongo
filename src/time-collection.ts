import { Document, OptionalUnlessRequiredId, WithId, WithoutId } from 'mongodb'
import { TsReadWriteCollection } from './collection'
import { convertReadWriteCollection } from './converter'
import { DocumentWithId, TimeOptions, TsUpdate } from './types'

export type WithTime<T> = T & {
  createdAt: Date
  updatedAt: Date
}

export type DocumentWithIdTime = DocumentWithId & {
  createdAt: Date
  updatedAt: Date
}

/**
 * Note that `replaceOne` and `findOneAndReplace` methods will overwrite the
 * `createdAt` and `updatedAt` fields with a new Date value. The replace methods
 * with option `upsert=True` can create a new document and need to set
 * `createdAt` to guarantee the field is always set.
 */
export const convertToTimeCollection = <TSchema extends Document>(
  collection: TsReadWriteCollection<
    WithTime<TSchema>,
    WithId<WithTime<TSchema>>
  >
) =>
  convertReadWriteCollection<
    WithTime<TSchema>,
    TSchema,
    WithId<WithTime<TSchema>>
  >(collection, {
    preInsert: (
      obj: OptionalUnlessRequiredId<TSchema>
    ): OptionalUnlessRequiredId<WithTime<TSchema>> => {
      const date = new Date()
      return { ...obj, createdAt: date, updatedAt: date } as any
    },
    preUpdate: (
      obj: TsUpdate<TSchema>,
      options: TimeOptions | undefined
    ): TsUpdate<WithTime<TSchema>> => {
      const date = new Date()
      const { setUpdatedAt = true } = options ?? {}
      return {
        ...(obj as TsUpdate<WithTime<TSchema>>),
        $setOnInsert: { ...obj.$setOnInsert, createdAt: date } as any,
        $set: {
          ...obj.$set,
          ...(setUpdatedAt ? { updatedAt: date } : {}),
        } as any,
      }
    },
    preReplace: (obj: WithoutId<TSchema>): WithoutId<WithTime<TSchema>> => {
      const date = new Date()
      return { ...obj, createdAt: date, updatedAt: date } as any
    },
    postFind: (obj) => obj,
    preFilter: (obj) => obj,
  })
