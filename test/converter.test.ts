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

test('insertOne', async () => {
  const collection = await initializeCollection()
  const zColl = convertToZodCollection<WithTime<Example>>(
    collection,
    Schema,
    false
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
})

afterAll(() => closeDb())
