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
import { RemodelType } from './util'

export declare type RemodeledOptions<TSchema extends Document> = {
  sort?: TsSort<TSchema>
  projection?: TsProjection<TSchema>
}

export declare type TsFindOneAndDeleteOptions<TSchema extends Document> = RemodelType<
  RemodeledOptions<TSchema>,
  FindOneAndDeleteOptions
>

export declare type TsFindOneAndReplaceOptions<TSchema extends Document> = RemodelType<
  RemodeledOptions<TSchema>,
  FindOneAndReplaceOptions
>

export declare type TsFindOneAndUpdateOptions<TSchema extends Document> = RemodelType<
  RemodeledOptions<TSchema>,
  FindOneAndUpdateOptions
>

export declare type TsFindOptions<TSchema extends Document> = RemodelType<
  RemodeledOptions<TSchema>,
  FindOptions<TSchema>
>

export declare type TsFindCursor<TSchema extends Document> = RemodelType<
  {
    clone(): TsFindCursor<TSchema>
    map<T extends Document>(transform: (doc: TSchema) => T): TsFindCursor<T>
    project<T extends Document>(value: TsProjection<TSchema>): TsFindCursor<T>
    sort(sort: TsSort<TSchema> | string, direction?: SortDirection): TsFindCursor<TSchema>
  },
  FindCursor<TSchema>
>
