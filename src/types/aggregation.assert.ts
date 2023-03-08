<<<<<<< HEAD
import * as ta from "type-assertions";
import { Pipeline, TsLookup } from "./aggregation";

type ExampleTSchema = {
  a: number;
  b: string;
};

type ExampleTSchemaOther = {
  c: number;
};

type CorrectLookupExample = { from: ""; localField: "a"; foreignField: "c"; as: "" };
type IncorrectLookupExample = { from: ""; localField: "a"; foreignField: "d"; as: "" };

// Test TsLookup equivalence
ta.assert<ta.Extends<CorrectLookupExample, TsLookup<ExampleTSchema, ExampleTSchemaOther>>>();
ta.assert<ta.Not<ta.Extends<IncorrectLookupExample, TsLookup<ExampleTSchema, ExampleTSchemaOther>>>>();

// Test Pipeline $match
ta.assert<ta.Extends<{ $match: { a: number } }, Pipeline<ExampleTSchema, ExampleTSchemaOther>>>();
ta.assert<ta.Extends<{ $match: { b: string } }, Pipeline<ExampleTSchema, ExampleTSchemaOther>>>();
ta.assert<ta.Extends<{ $match: { a: number; b: string } }, Pipeline<ExampleTSchema, ExampleTSchemaOther>>>();
ta.assert<ta.Extends<{ $match: { a: number; b: string } }, Pipeline<ExampleTSchema, ExampleTSchemaOther>>>();
ta.assert<ta.Not<ta.Extends<{ $match: { a: string } }, Pipeline<ExampleTSchema, ExampleTSchemaOther>>>>();
ta.assert<ta.Not<ta.Extends<{ $match: { c: number } }, Pipeline<ExampleTSchema, ExampleTSchemaOther>>>>();

// Test Pipeline $project
ta.assert<ta.Extends<{ $project: { a: 1 } }, Pipeline<ExampleTSchema, ExampleTSchemaOther>>>();
ta.assert<ta.Extends<{ $project: { b: 1 } }, Pipeline<ExampleTSchema, ExampleTSchemaOther>>>();
ta.assert<ta.Not<ta.Extends<{ $project: { a: "1" } }, Pipeline<ExampleTSchema, ExampleTSchemaOther>>>>();
ta.assert<ta.Not<ta.Extends<{ $project: { c: 1 } }, Pipeline<ExampleTSchema, ExampleTSchemaOther>>>>();

// Test Pipeline $sort
ta.assert<ta.Extends<{ $sort: { a: -1 } }, Pipeline<ExampleTSchema, ExampleTSchemaOther>>>();
ta.assert<ta.Extends<{ $sort: { b: 1 } }, Pipeline<ExampleTSchema, ExampleTSchemaOther>>>();
ta.assert<ta.Not<ta.Extends<{ $sort: { c: -1 } }, Pipeline<ExampleTSchema, ExampleTSchemaOther>>>>();

// Test Pipeline $lookup
ta.assert<ta.Extends<{ $lookup: CorrectLookupExample }, Pipeline<ExampleTSchema, ExampleTSchemaOther>>>();
ta.assert<ta.Not<ta.Extends<{ $lookup: IncorrectLookupExample }, Pipeline<ExampleTSchema, ExampleTSchemaOther>>>>();

// Test Pipeline $group
ta.assert<ta.Extends<{ $group: { _id: { a: number } } }, Pipeline<ExampleTSchema, ExampleTSchemaOther>>>();
ta.assert<ta.Not<ta.Extends<{ $group: { _id: string } }, Pipeline<ExampleTSchema, ExampleTSchemaOther>>>>();
=======
import * as ta from 'type-assertions'
import { TsLookup, Pipeline } from './aggregation'

type ExampleTSchema = {
  a: number[]
  b: string
  c: number
}

type ExampleTSchemaOther = {
  x: number
}

type CorrectLookupExample = {
  from: ''
  localField: 'a'
  foreignField: 'x'
  as: ''
}
type IncorrectLookupExample = {
  from: ''
  localField: 'a'
  foreignField: 'd'
  as: ''
}

// Test TsLookup equivalence
ta.assert<
  ta.Extends<
    CorrectLookupExample,
    TsLookup<ExampleTSchema, ExampleTSchemaOther>
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      IncorrectLookupExample,
      TsLookup<ExampleTSchema, ExampleTSchemaOther>
    >
  >
>()

// Test Pipeline $match
ta.assert<
  ta.Extends<
    { $match: { a: [1, 2] } },
    Pipeline<ExampleTSchema, ExampleTSchemaOther>
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      { $match: { a: '' } },
      Pipeline<ExampleTSchema, ExampleTSchemaOther>
    >
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      { $match: { x: [1, 2] } },
      Pipeline<ExampleTSchema, ExampleTSchemaOther>
    >
  >
>()

// Test Pipeline $project
ta.assert<
  ta.Extends<
    { $project: { a: 1 } },
    Pipeline<ExampleTSchema, ExampleTSchemaOther>
  >
>()
ta.assert<
  ta.Extends<
    { $project: { b: 1 } },
    Pipeline<ExampleTSchema, ExampleTSchemaOther>
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      { $project: { a: '1' } },
      Pipeline<ExampleTSchema, ExampleTSchemaOther>
    >
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      { $project: { x: 1 } },
      Pipeline<ExampleTSchema, ExampleTSchemaOther>
    >
  >
>()

// Test Pipeline $sort
ta.assert<
  ta.Extends<
    { $sort: { c: -1 } },
    Pipeline<ExampleTSchema, ExampleTSchemaOther>
  >
>()
ta.assert<
  ta.Extends<
    { $sort: { b: -1 } },
    Pipeline<ExampleTSchema, ExampleTSchemaOther>
  >
>()

// Test Pipeline $lookup
ta.assert<
  ta.Extends<
    { $lookup: CorrectLookupExample },
    Pipeline<ExampleTSchema, ExampleTSchemaOther>
  >
>()
ta.assert<
  ta.Not<
    ta.Extends<
      { $lookup: IncorrectLookupExample },
      Pipeline<ExampleTSchema, ExampleTSchemaOther>
    >
  >
>()
>>>>>>> 536d300 (add assertions for TsLookup (#4))
