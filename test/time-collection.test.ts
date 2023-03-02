import { ObjectId } from 'mongodb'
import { z } from 'zod'
import { convertToTimeCollection, mkTsCollection, WithTime } from '../src'
import { setupDb } from './util'

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
