import { z } from 'zod'
import { mkTsCollection, WithTime } from '../src'
import {
  convertReadWriteCollection,
  convertToZodCollection,
} from '../src/converter'
import { closeDb, setupDb } from './util'

const Example = z.object({
  a: z.string(),
  b: z.number().optional(),
})
type Example = z.infer<typeof Example>

const requiredValue = 'fixed'

const initializeCollection = async () => {
  const db = await setupDb()

  const adminCollection = mkTsCollection<WithTime<Example>>(
    db,
    'test-converter'
  )

  const collection = convertReadWriteCollection(adminCollection, {
    preInsert: (obj) => {
      if (obj.a !== requiredValue) throw new Error('Error!')
      return obj
    },
    preUpdate: (obj) => obj,
    preReplace: (obj) => obj,
    postFind: (obj) => obj,
    preFilter: (obj) => {
      if ((obj as WithTime<Example>).a !== requiredValue)
        throw new Error('Error!')
      return obj
    },
  })
  await adminCollection.deleteMany({})
  return collection
}

test('insertOne', async () => {
  const collection = await initializeCollection()
  await expect(collection.insertOne({ a: requiredValue })).resolves.toBeTruthy()
  expect(() => collection.insertOne({ a: 'another value' })).toThrow()
})

test('findOne', async () => {
  const collection = await initializeCollection()
  await expect(collection.findOne({ a: requiredValue })).resolves.toBeNull()
  expect(() => collection.findOne({ a: 'another value' })).toThrow()
})

test('find', async () => {
  const collection = await initializeCollection()
  await expect(
    collection.find({ a: requiredValue }).toArray()
  ).resolves.toEqual([])
  expect(() => collection.find({ a: 'another value' })).toThrow()
})

const Schema = z.object({
  a: z.string(),
  b: z.number().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

const timeValues = {
  createdAt: new Date(),
  updatedAt: new Date(),
}

test('zodCollection:insertOne', async () => {
  const collection = await initializeCollection()
  const zColl = convertToZodCollection<WithTime<Example>>(collection, Schema)

  await expect(
    zColl.insertOne({ ...timeValues, a: requiredValue })
  ).resolves.toBeTruthy()
  expect(() =>
    zColl.insertOne({
      ...timeValues,
      a: 'another value',
    })
  ).toThrow()
  expect(() =>
    zColl.insertOne({
      c: 'some value',
      d: 'another value',
    } as any)
  ).toThrow()
})

test('zodCollection:insertOne:silentError', async () => {
  const collection = await initializeCollection()
  const zColl = convertToZodCollection<WithTime<Example>>(
    collection,
    Schema,
    true
  )

  await expect(
    zColl.insertOne({ ...timeValues, a: requiredValue })
  ).resolves.toBeTruthy()
  expect(() =>
    zColl.insertOne({
      ...timeValues,
      a: 'another value',
    })
  ).toThrow()
  expect(() =>
    zColl.insertOne({
      c: 'some value',
      d: 'another value',
    } as any)
  ).toThrow()
})

test('zodCollection:updateOne', async () => {
  const collection = await initializeCollection()
  const zColl = convertToZodCollection<WithTime<Example>>(collection, Schema)
  const insertResult = await zColl.insertOne({
    ...timeValues,
    a: requiredValue,
  })
  expect(insertResult).toBeTruthy()

  expect(
    zColl.updateOne(
      { _id: insertResult.insertedId, a: requiredValue },
      {
        $set: {
          ...timeValues,
          a: 'another value',
        },
      }
    )
  ).resolves.toBeTruthy()

  // Note: Does not pass due to the issue mentioned in converter.ts
  // Note: Passes when 'silentError' is true (see test 'zodCollection:updateOne:silentError')
  expect(
    zColl.updateOne(
      { _id: insertResult.insertedId, a: requiredValue },
      {
        $set: {
          ...timeValues,
        },
      }
    )
  ).resolves.toBeTruthy()
  expect(() =>
    zColl.updateOne(
      { _id: insertResult.insertedId },
      {
        $set: {
          c: 'some value',
          d: 'another value',
        } as any,
      }
    )
  ).toThrow()
})

test('zodCollection:updateOne:silentError', async () => {
  const collection = await initializeCollection()
  const zColl = convertToZodCollection<WithTime<Example>>(
    collection,
    Schema,
    true
  )
  const insertResult = await zColl.insertOne({
    ...timeValues,
    a: requiredValue,
  })
  expect(insertResult).toBeTruthy()

  expect(
    zColl.updateOne(
      { _id: insertResult.insertedId, a: requiredValue },
      {
        $set: {
          ...timeValues,
          a: 'another value',
        },
      }
    )
  ).resolves.toBeTruthy()

  expect(
    zColl.updateOne(
      { _id: insertResult.insertedId, a: requiredValue },
      {
        $set: {
          ...timeValues,
        },
      }
    )
  ).resolves.toBeTruthy()
  expect(() =>
    zColl.updateOne(
      { _id: insertResult.insertedId },
      {
        $set: {
          c: 'some value',
          d: 'another value',
        } as any,
      }
    )
  ).toThrow()
})

test('zodCollection:replaceOne', async () => {
  const collection = await initializeCollection()
  const zColl = convertToZodCollection<WithTime<Example>>(collection, Schema)

  const insertResult = await zColl.insertOne({
    ...timeValues,
    a: requiredValue,
  })
  expect(insertResult).toBeTruthy()

  expect(() =>
    zColl.replaceOne(
      { _id: insertResult.insertedId },
      {
        ...timeValues,
        a: 'another value',
      }
    )
  ).toThrow()

  expect(() =>
    zColl.insertOne({
      c: 'some value',
      d: 'another value',
    } as any)
  ).toThrow()
})

test('zodCollection:replaceOne:silentError', async () => {
  const collection = await initializeCollection()
  const zColl = convertToZodCollection<WithTime<Example>>(
    collection,
    Schema,
    true
  )

  const insertResult = await zColl.insertOne({
    ...timeValues,
    a: requiredValue,
  })
  expect(insertResult).toBeTruthy()

  expect(() =>
    zColl.replaceOne(
      { _id: insertResult.insertedId },
      {
        ...timeValues,
        a: 'another value',
      }
    )
  ).toThrow()

  expect(() =>
    zColl.insertOne({
      c: 'some value',
      d: 'another value',
    } as any)
  ).toThrow()
})

afterAll(() => closeDb())
