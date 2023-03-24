import { OperationTime, ResumeToken } from 'mongodb'
import { AllowOnlyOne } from '../util'

type ChangeStreamOptions = {
  allChangesForCluster?: boolean
  fullDocument?:
    | 'default'
    | 'required'
    | 'whenAvailable'
    | 'changeStreamPreAndPostImages'
    | 'updateLookup'
  fullDocumentBeforeChange?: 'off' | 'whenAvailable' | 'required'
  resumeAfter?: ResumeToken
  showExpandedEvents?: boolean
  startAfter?: ResumeToken
  startAtOperationTime?: OperationTime
}

/**
 * https://www.mongodb.com/docs/v6.0/reference/operator/aggregation/changeStream/
 */
export declare type TsChangeStreamOptions = AllowOnlyOne<
  ChangeStreamOptions,
  'resumeAfter' | 'startAfter' | 'startAtOperationTime'
>
