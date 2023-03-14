import { Document, ObjectId } from 'mongodb'
import { FlattenFilterPaths, FlattenSortType } from './flatten'

declare type SortDirectionString =
  | SortDirection
  | {
      $meta: 'textScore' | 'indexKey'
    }

export declare type SortDirection =
  | 1
  | -1
  | 'asc'
  | 'desc'
  | 'ascending'
  | 'descending'

// Needs to extends Document, not Doc because recursive structure of Doc will not work here
export declare type TsSort<TSchema extends Document> = {
  [Property in FlattenFilterPaths<TSchema>]?: NonNullable<
    FlattenSortType<TSchema, Property>
  > extends number | boolean | Date | ObjectId
    ? SortDirection
    : NonNullable<FlattenSortType<TSchema, Property>> extends string
    ? SortDirectionString
    : never
}
