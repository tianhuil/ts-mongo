import { Document } from 'mongodb'
import { FlattenFilterPaths } from '../flatten'

export declare type TsLookup<
  TSchema extends Document,
  TSchemaLookup extends Document
> = {
  from: string
  localField: FlattenFilterPaths<TSchema>
  foreignField: FlattenFilterPaths<TSchemaLookup>
  as: string
}
