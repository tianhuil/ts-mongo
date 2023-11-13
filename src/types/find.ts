import {
  Document,
  FindCursor,
  FindOneAndDeleteOptions,
  FindOneAndReplaceOptions,
  FindOneAndUpdateOptions,
  FindOptions,
} from 'mongodb'
import { TsProjection } from './projection'
import { SortDirection, TsSort } from './sort'
import { RemodelType, TimeOptions } from './util'

// Remove sort and projection from options; instead use project / sort on the cursor
// Remove includeResultMetadata, which is almost never used
// These simplifies return types
export declare type TsFindOneAndDeleteOptions = Omit<
  FindOneAndDeleteOptions,
  'sort' | 'projection' | 'includeResultMetadata'
>

export declare type TsFindOneAndReplaceOptions = Omit<
  FindOneAndReplaceOptions,
  'sort' | 'projection' | 'includeResultMetadata'
>

export declare type TsFindOneAndUpdateOptions = TimeOptions &
  Omit<FindOneAndUpdateOptions, 'sort' | 'projection' | 'includeResultMetadata'>

export declare type TsFindOptions = Omit<FindOptions, 'sort' | 'projection'>

export declare type TsFindCursor<TSchema extends Document> = RemodelType<
  {
    clone(): TsFindCursor<TSchema>
    map<T extends Document>(transform: (doc: TSchema) => T): TsFindCursor<T>
    project<T extends Document>(value: TsProjection<TSchema>): TsFindCursor<T>
    sort(
      sort: TsSort<TSchema> | string,
      direction?: SortDirection
    ): TsFindCursor<TSchema>
  },
  FindCursor<TSchema>
>
