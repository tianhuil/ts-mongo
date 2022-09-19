import { ModifyResult } from 'mongodb'
import { DocumentWithId } from './util'

export declare interface TsModifyResult<TSchema extends DocumentWithId>
  extends ModifyResult<TSchema> {}
