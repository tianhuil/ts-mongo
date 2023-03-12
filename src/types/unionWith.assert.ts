import * as ta from 'type-assertions'
import { TsUnionWith } from './unionWith'

type ExampleTSchema = {
  a: number[]
  b: string
  c: number
}

// Test coll field requirement
ta.assert<ta.Not<ta.Extends<{}, TsUnionWith<ExampleTSchema>>>>()

// Test coll field
ta.assert<ta.Extends<{ coll: string }, TsUnionWith<ExampleTSchema>>>()
ta.assert<ta.Not<ta.Extends<{ coll: null }, TsUnionWith<ExampleTSchema>>>>()
ta.assert<ta.Not<ta.Extends<{ coll: number }, TsUnionWith<ExampleTSchema>>>>()

// Test pipeline field
ta.assert<
  ta.Extends<
    { coll: string; pipeline: [{ $match: { a: [1, 2] } }] },
    TsUnionWith<ExampleTSchema>
  >
>()
ta.assert<
  ta.Extends<{ coll: string; pipeline: [] }, TsUnionWith<ExampleTSchema>>
>()
ta.assert<
  ta.Not<
    ta.Extends<
      {
        coll: string
        pipeline: [{ $out: { db: string; coll: string } }]
      },
      TsUnionWith<ExampleTSchema>
    >
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      {
        coll: string
        pipeline: [{ $merge: { into: string } }]
      },
      TsUnionWith<ExampleTSchema>
    >
  >
>()
