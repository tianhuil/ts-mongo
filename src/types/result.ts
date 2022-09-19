import { DocumentWithId } from './util'

export declare interface TsModifyResult<TSchema extends DocumentWithId> {
  value: TSchema | null
  lastErrorObject?: Document
  ok: 0 | 1
}
