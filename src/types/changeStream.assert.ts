import { ResumeToken, Timestamp } from 'mongodb'
import * as ta from 'type-assertions'
import { TsChangeStreamOptions } from './changeStream'

// Test all options are optional
ta.assert<ta.Extends<{}, TsChangeStreamOptions>>()

// Test ChageStreamOptions equivalence
ta.assert<ta.Not<ta.Extends<string, TsChangeStreamOptions>>>()

// Test allChangesForCluster field
ta.assert<
  ta.Extends<{ allChangesForCluster: boolean }, TsChangeStreamOptions>
>()
ta.assert<
  ta.Not<ta.Extends<{ allChangesForCluster: number }, TsChangeStreamOptions>>
>()

// Test fullDocument field
ta.assert<
  ta.Extends<
    { fullDocument: 'changeStreamPreAndPostImages' },
    TsChangeStreamOptions
  >
>()
ta.assert<ta.Not<ta.Extends<{ fullDocument: string }, TsChangeStreamOptions>>>()
ta.assert<ta.Not<ta.Extends<{ fullDocument: number }, TsChangeStreamOptions>>>()

// Test fullDocumentBeforeChange field
ta.assert<
  ta.Extends<
    { fullDocumentBeforeChange: 'whenAvailable' },
    TsChangeStreamOptions
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<{ fullDocumentBeforeChange: string }, TsChangeStreamOptions>
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<{ fullDocumentBeforeChange: number }, TsChangeStreamOptions>
  >
>()

// Test resumeAfter field
ta.assert<ta.Extends<{ resumeAfter: ResumeToken }, TsChangeStreamOptions>>()

// Test showExpandedEvents field
ta.assert<ta.Extends<{ showExpandedEvents: boolean }, TsChangeStreamOptions>>()
ta.assert<
  ta.Not<ta.Extends<{ showExpandedEvents: 1 }, TsChangeStreamOptions>>
>()
ta.assert<
  ta.Not<ta.Extends<{ showExpandedEvents: null }, TsChangeStreamOptions>>
>()
ta.assert<
  ta.Not<ta.Extends<{ showExpandedEvents: string }, TsChangeStreamOptions>>
>()

// Test startAfter field
ta.assert<ta.Extends<{ startAfter: ResumeToken }, TsChangeStreamOptions>>()

// Test startAtOperationTime field
ta.assert<
  ta.Extends<{ startAtOperationTime: Timestamp }, TsChangeStreamOptions>
>()
ta.assert<
  ta.Not<ta.Extends<{ startAtOperationTime: number }, TsChangeStreamOptions>>
>()
ta.assert<
  ta.Not<ta.Extends<{ startAtOperationTime: string }, TsChangeStreamOptions>>
>()

// Test only one of resumeAfter, startAfter and startAtOperationTime fields can be used
ta.assert<
  ta.Not<
    ta.Extends<
      {
        resumeAfter: ResumeToken
        startAfter: ResumeToken
      },
      TsChangeStreamOptions
    >
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      {
        resumeAfter: ResumeToken
        startAtOperationTime: ResumeToken
      },
      TsChangeStreamOptions
    >
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      {
        startAfter: ResumeToken
        startAtOperationTime: ResumeToken
      },
      TsChangeStreamOptions
    >
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      {
        resumeAfter: ResumeToken
        startAfter: ResumeToken
        startAtOperationTime: ResumeToken
      },
      TsChangeStreamOptions
    >
  >
>()
