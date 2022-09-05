import { Document, ObjectId } from 'mongodb'
import { FilterType } from './filter'
import { FlattenFilterPaths } from './flatten'

export declare type SortDirectionString =
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

export declare type Sort<TSchema extends Document> = {
  [Property in FlattenFilterPaths<TSchema>]?: FilterType<
    TSchema,
    Property
  > extends number | boolean | Date | ObjectId
    ? SortDirection
    : FilterType<TSchema, Property> extends string
    ? SortDirectionString
    : never
}
