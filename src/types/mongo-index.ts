import { Document } from 'mongodb'
import { FlattenFilterPaths } from './flatten'

export declare type IndexDirection = -1 | 1 | 'text'

/**
 * Supports dot notation
 * https://www.mongodb.com/docs/manual/core/index-single/#create-an-index-on-an-embedded-field
 */
export declare type IndexSpecification<TSchema extends Document> =
  | [FlattenFilterPaths<TSchema>, IndexDirection]
  | {
      [key in FlattenFilterPaths<TSchema>]?: IndexDirection
    }
  | [FlattenFilterPaths<TSchema>, IndexDirection][]
  | {
      [key in FlattenFilterPaths<TSchema>]?: IndexDirection
    }[]
