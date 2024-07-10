import { ObjectId } from 'mongodb'
import { z } from 'zod'
import { convertToTimeCollection, mkTsCollection, WithTime } from '../src'
import { closeDb, setupDb } from './util'

const delay = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

const Example = z.object({
  a: z.string(),
  b: z.number().optional(),
})
type Example = z.infer<typeof Example>

const initializeTimeCollection = async () => {
  const db = await setupDb()

  const collection = convertToTimeCollection(
    mkTsCollection<WithTime<Example>>(db, 'test')
  )
  await collection.deleteMany({})
  return collection
}

test('insertOne', async () => {
  const collection = await initializeTimeCollection()
  const result = await collection.insertOne({ a: 'a' })
  expect(result.acknowledged).toBeTruthy()
  expect(result.insertedId).toBeInstanceOf(ObjectId)
  const result2 = await collection.findOne({ a: 'a' })
  expect(result2?.createdAt).toBeInstanceOf(Date)
  expect(result2?.updatedAt).toBeInstanceOf(Date)
})

test('findOne', async () => {
  const collection = await initializeTimeCollection()
  await collection.insertOne({ a: 'a' })

  const date = new Date()
  expect((await collection.findOne({ createdAt: { $lte: date } }))?.a).toEqual(
    'a'
  )
  expect(await collection.findOne({ createdAt: { $gt: date } })).toBeFalsy()
})

test('updateOne', async () => {
  const collection = await initializeTimeCollection()
  await collection.insertOne({ a: 'a' })

  await delay(5)
  const time = new Date().getTime()
  await delay(5)
  await collection.updateOne({ a: 'a' }, { $set: { a: 'b' } })
  const result = await collection.findOne({ a: 'b' })
  expect(result?.createdAt.getTime()).toBeLessThan(time)
  expect(result?.updatedAt.getTime()).toBeGreaterThan(time)
})

test('updatedAt should not be updated if `setUpdatedAt` is false', async () => {
  const collection = await initializeTimeCollection()
  await collection.insertOne({ a: 'a' })
  const result1 = await collection.findOne({ a: 'a' })

  await delay(5)
  await collection.updateOne(
    { a: 'a' },
    { $set: { a: 'b' } },
    { setUpdatedAt: false }
  )
  const result2 = await collection.findOne({ a: 'b' })
  expect(result1?.updatedAt.getTime()).toStrictEqual(
    result2?.updatedAt.getTime()
  )
})

test('replaceOne', async () => {
  const collection = await initializeTimeCollection()
  await collection.insertOne({ a: 'firstInsertion' })
  const result1 = await collection.findOne({ a: 'firstInsertion' })
  await delay(5)
  await collection.replaceOne({ a: 'firstInsertion' }, { a: 'replaced' })
  const result2 = await collection.findOne({ a: 'replaced' })
  if (!result1 || !result2) {
    throw new Error('db result is unexpectedly null')
  }
  expect(result1.createdAt.getTime()).toBeLessThan(result2.createdAt.getTime())
})

afterAll(() => closeDb())
