import { z } from 'zod'
import { convertToZodCollection, TsReadWriteCollection, WithTime } from '../src'
import { closeDb, mkTsTestCollection } from './util'
import { ObjectId, WithId } from 'mongodb'

const ZExample = z.object({
  a: z.number(),
  b: z.string(),
  numbers: z.number().array(),
})
interface ZExample extends z.infer<typeof ZExample> {}

const mkZodCollection = async () => {
  const col = await mkTsTestCollection<WithTime<ZExample>>()
  return convertToZodCollection(col, ZExample)
}

test('Documents should be parsed correctly on insert', async () => {
  const zodCol = await mkZodCollection()

  expect(() =>
    // @ts-expect-error
    zodCol.insertOne({ a: 'string', b: 'string', numbers: [9] })
  ).toThrow()
  await expect(
    zodCol.insertOne({ a: 0, b: 'string', numbers: [0] })
  ).resolves.toBeTruthy()
})

test('Should allow inserting documents with _id even if not in schema', async () => {
  const zodCol = await mkZodCollection()

  const id = new ObjectId()
  const { insertedId } = await zodCol.insertOne({
    a: 0,
    b: 'string',
    numbers: [0],
    _id: id,
  })
  expect(insertedId.equals(id)).toBeTruthy()

  expect(() =>
    // @ts-expect-error
    zodCol.insertOne({ a: 'string', b: 'string', numbers: [0], _id: null })
  ).toThrow()

  expect(() =>
    zodCol.insertOne({
      a: 0,
      b: 'string',
      numbers: [0],
      // @ts-expect-error
      _id: 'idStr',
    })
  ).toThrow()
})

test('Documents should be parsed correctly on update', async () => {
  const zodCol = await mkZodCollection()

  expect(() => zodCol.updateOne({}, { $set: { a: 'string' as any } })).toThrow()
  await expect(
    zodCol.updateOne({}, { $set: { a: 0 as any } })
  ).resolves.toBeTruthy()

  // @ts-expect-error
  expect(() => zodCol.updateOne({}, { $pull: { a: 0 } })).toThrow()
  await expect(
    zodCol.updateOne({}, { $pull: { numbers: 0 as any } })
  ).resolves.toBeTruthy()

  // @ts-expect-error
  expect(() => zodCol.updateOne({}, { $push: { a: 0 } })).toThrow()
  await expect(
    zodCol.updateOne({}, { $push: { numbers: 0 as any } })
  ).resolves.toBeTruthy()

  // @ts-expect-error
  expect(() => zodCol.updateOne({}, { $addToSet: { a: 0 } })).toThrow()
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
