import * as ta from 'type-assertions'
import { TsReadWriteCollection } from '../collection'
import { ObjectId } from 'mongodb'

type DistinctSampleType = {
  _id: ObjectId
  str: string
  nested: {
    field: number
  }
}

type TestCollection = TsReadWriteCollection<
  DistinctSampleType & { writeOnly: boolean },
  DistinctSampleType & { readOnly: boolean }
>

const distinctString = (c: TestCollection) => c.distinct('str', {})
const distinctId = (c: TestCollection) => c.distinct('_id', {})
const distinctNested = (c: TestCollection) => c.distinct('nested.field', {})
const distinctReadOnly = (c: TestCollection) => c.distinct('readOnly', {})

ta.assert<ta.Equal<Awaited<ReturnType<typeof distinctString>>, string[]>>()
ta.assert<ta.Equal<Awaited<ReturnType<typeof distinctId>>, ObjectId[]>>()
ta.assert<ta.Equal<Awaited<ReturnType<typeof distinctNested>>, number[]>>()
ta.assert<ta.Equal<Awaited<ReturnType<typeof distinctReadOnly>>, boolean[]>>()

// @ts-expect-error
const _distinctIncorrect = (c: TestCollection) => c.distinct('no', {})

// @ts-expect-error
const _distinctWriteOnly = (c: TestCollection) => c.distinct('writeOnly', {})
