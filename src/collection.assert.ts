import type {
  Collection,
  DeleteOptions,
  DeleteResult,
  Filter,
  ObjectId,
  WithId,
} from 'mongodb'
import * as ta from 'type-assertions'
import {
  TsCollection,
  TsReadCollection,
  TsReadWriteCollection,
} from './collection'
import type { TsFilter, TsFindOneAndDeleteOptions } from './types'

type TSchema = { a: string; _id: ObjectId }

// Type inference for Collection
ta.assert<ta.Extends<Collection<TSchema>, { count(): Promise<number> }>>()
ta.assert<
  ta.Not<ta.Extends<Collection<TSchema>, { notMember(): Promise<number> }>>
>()

ta.assert<
  ta.Extends<
    Collection<TSchema>,
    { findOne(): Promise<WithId<TSchema> | null> }
  >
>()
ta.assert<
  ta.Extends<
    Collection<TSchema>,
    { countDocuments(filter: Filter<TSchema>): Promise<number> }
  >
>()

ta.assert<
  ta.Extends<
    TsCollection<TSchema>,
    { countDocuments(filter: TsFilter<TSchema>): Promise<number> }
  >
>()
ta.assert<
  ta.Not<ta.Extends<TsCollection<TSchema>, { notMember(): Promise<number> }>>
>()

ta.assert<
  ta.Extends<
    TsCollection<TSchema>,
    { findOne(filter: TsFilter<TSchema>): Promise<WithId<TSchema> | null> }
  >
>()
ta.assert<
  ta.Extends<
    Collection<TSchema>,
    { countDocuments(filter: TsFilter<TSchema>): Promise<number> }
  >
>()

// Read only collection tests

ta.assert<
  ta.Not<
    ta.Extends<
      TsReadCollection<TSchema>,
      {
        findOneAndDelete(
          filter: TsFilter<TSchema>,
          options?: TsFindOneAndDeleteOptions
        ): Promise<TSchema | null>
      }
    >
  >
>()

ta.assert<
  ta.Not<
    ta.Extends<
      TsReadCollection<TSchema>,
      {
        deleteOne(
          filter: TsFilter<TSchema>,
          options?: DeleteOptions
        ): Promise<DeleteResult>
      }
    >
  >
>()

type DistinctSampleType = {
  _id: ObjectId
  str: string
  nested: {
    field: number
  }
}

type TestCollection = TsReadWriteCollection<
  DistinctSampleType & { writeOnly: boolean },
  DistinctSampleType & { readOnly: boolean }
>

const distinctString = (c: TestCollection) => c.distinct('str', {})
const distinctId = (c: TestCollection) => c.distinct('_id', {})
const distinctNested = (c: TestCollection) => c.distinct('nested.field', {})
const distinctReadOnly = (c: TestCollection) => c.distinct('readOnly', {})

ta.assert<ta.Equal<Awaited<ReturnType<typeof distinctString>>, string[]>>()
ta.assert<ta.Equal<Awaited<ReturnType<typeof distinctId>>, ObjectId[]>>()
ta.assert<ta.Equal<Awaited<ReturnType<typeof distinctNested>>, number[]>>()
ta.assert<ta.Equal<Awaited<ReturnType<typeof distinctReadOnly>>, boolean[]>>()

// @ts-expect-error
const _distinctIncorrect = (c: TestCollection) => c.distinct('no', {})

// @ts-expect-error
const _distinctWriteOnly = (c: TestCollection) => c.distinct('writeOnly', {})
