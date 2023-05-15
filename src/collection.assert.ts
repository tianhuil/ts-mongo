import type {
  Collection,
  DeleteOptions,
  DeleteResult,
  Filter,
  ObjectId,
  WithId,
} from 'mongodb'
import * as ta from 'type-assertions'
import type { TsCollection, TsReadCollection } from './collection'
import type { TsFilter, TsFindOneAndDeleteOptions } from './types'
import type { TsModifyResult } from './types/result'

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
        ): Promise<TsModifyResult<TSchema>>
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
