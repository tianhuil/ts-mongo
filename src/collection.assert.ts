import { Collection, Filter, ObjectId, WithId } from 'mongodb'
import * as ta from 'type-assertions'
import { TsCollection } from './collection'
import { TsFilter } from './types'

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
