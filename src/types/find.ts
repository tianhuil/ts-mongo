import {
  Document,
  FindCursor,
  FindOneAndDeleteOptions,
  FindOneAndReplaceOptions,
  FindOneAndUpdateOptions,
  FindOptions,
} from 'mongodb'
import { Projection } from './projection'
import { Sort } from './sort'
import { RemodelType } from './util'

export declare type RemodeledOptions<TSchema extends Document> = {
  sort?: Sort<TSchema>
  projection?: Projection<TSchema>
}

export declare type TsFindOneAndDeleteOptions<TSchema extends Document> =
  RemodelType<RemodeledOptions<TSchema>, FindOneAndDeleteOptions>

export declare type TsFindOneAndReplaceOptions<TSchema extends Document> =
  RemodelType<RemodeledOptions<TSchema>, FindOneAndReplaceOptions>

export declare type TsFindOneAndUpdateOptions<TSchema extends Document> =
  RemodelType<RemodeledOptions<TSchema>, FindOneAndUpdateOptions>

export declare type TsFindOptions<TSchema extends Document> = RemodelType<
  RemodeledOptions<TSchema>,
  FindOptions<TSchema>
>

export declare type TsFindCursor<TSchema extends Document> = RemodelType<
  {
    clone(): TsFindCursor<TSchema>
    map<T extends Document>(transform: (doc: TSchema) => T): TsFindCursor<T>
    project<T extends Document>(value: Projection<TSchema>): TsFindCursor<T>
    sort(sort: Sort<TSchema>): TsFindCursor<TSchema>
  },
  FindCursor
>
