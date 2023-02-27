import { Document, OptionalUnlessRequiredId, WithId } from 'mongodb'
import { TsReadWriteCollection } from './collection'
import { convertReadWriteCollection } from './converter'
import { DocumentWithId, TsUpdate } from './types'

export type WithTime<T> = T & {
  createdAt: Date
  updatedAt: Date
}

export type DocumentWithIdTime = DocumentWithId & {
  createdAt: Date
  updatedAt: Date
}

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
    preUpdate: (obj: TsUpdate<TSchema>): TsUpdate<WithTime<TSchema>> => {
      const date = new Date()
      return {
        ...(obj as TsUpdate<WithTime<TSchema>>),
        $setOnInsert: { ...obj.$setOnInsert, createdAt: date } as any,
        $set: { ...obj.$set, updatedAt: date } as any,
      }
    },
    preReplace: () => {
      throw Error('Does not support replace')
    },
    postFind: (obj) => obj,
    preFilter: (obj) => obj,
  })
