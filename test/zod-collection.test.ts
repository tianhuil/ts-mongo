import { z } from 'zod'
import { convertToZodCollection } from '../src'
import { closeDb, mkTsTestCollection } from './util'
import { ObjectId } from 'mongodb'

const ZExample = z.object({
  a: z.number(),
  b: z.string(),
  numbers: z.number().array(),
})

const mkZodCollection = async () => {
  const col = await mkTsTestCollection()
  // use any here so we can insert wrong values without upsetting typescript
  const zodCol = convertToZodCollection<any>(col, ZExample)
  return zodCol
}

test('Documents should be parsed correctly on insert', async () => {
  const zodCol = await mkZodCollection()

  expect(() =>
    zodCol.insertOne({ a: 'string', b: 'string', numbers: [9] })
  ).toThrow()
  await expect(
    zodCol.insertOne({ a: 0, b: 'string', numbers: [0] })
  ).resolves.toBeTruthy()

  const id = new ObjectId()
  const { insertedId } = await zodCol.insertOne({
    a: 0,
    b: 'string',
    numbers: [0],
    _id: id,
  })
  expect(insertedId.equals(id)).toBeTruthy()

  expect(() => zodCol.insertMany([{ a: 0, b: 0 }])).toThrow()
  await expect(
    zodCol.insertMany([{ a: 0, b: 'string', numbers: [7] }])
  ).resolves.toBeTruthy()
})

test('Documents should be parsed correctly on update', async () => {
  const zodCol = await mkZodCollection()

  expect(() => zodCol.updateOne({}, { $set: { a: 'string' as any } })).toThrow()
  await expect(
    zodCol.updateOne({}, { $set: { a: 0 as any } })
  ).resolves.toBeTruthy()

  expect(() => zodCol.updateOne({}, { $pull: { a: 0 as any } })).toThrow()
  await expect(
    zodCol.updateOne({}, { $pull: { numbers: 0 as any } })
  ).resolves.toBeTruthy()

  expect(() => zodCol.updateOne({}, { $push: { a: 0 as any } })).toThrow()
  await expect(
    zodCol.updateOne({}, { $push: { numbers: 0 as any } })
  ).resolves.toBeTruthy()

  expect(() => zodCol.updateOne({}, { $addToSet: { a: 0 as any } })).toThrow()
  await expect(
    zodCol.updateOne({}, { $addToSet: { numbers: 0 as any } })
  ).resolves.toBeTruthy()

  expect(() =>
    zodCol.updateOne({}, { $setOnInsert: { a: 'string' as any } })
  ).toThrow()
  await expect(
    zodCol.updateOne({}, { $setOnInsert: { a: 0 as any } })
  ).resolves.toBeTruthy()
})

afterAll(() => closeDb())
