import * as ta from 'type-assertions'
import { TsLookup } from './lookup'

type ExampleTSchema = {
  a: number[]
  b: string
  c: number
}

type ExampleTSchemaLookup = {
  x: number
}

// Test TsLookup equivalence
ta.assert<
  ta.Extends<
    { from: ''; localField: 'a'; foreignField: 'x'; as: '' },
    TsLookup<ExampleTSchema, ExampleTSchemaLookup>
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      { from: ''; localField: 'a'; foreignField: 'd'; as: '' },
      TsLookup<ExampleTSchema, ExampleTSchemaLookup>
    >
  >
>()
