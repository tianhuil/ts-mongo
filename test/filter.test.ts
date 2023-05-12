import { closeDb, mkTsTestCollection } from './util'

type Example = { a: string; d: number }

const initializeData = async () => {
  const col = await mkTsTestCollection<Example>()
  await col.deleteMany({})
  const result = await col.insertMany([
    { a: 'hi', d: 5 },
    { a: 'bye', d: 10 },
  ])
  return col
}

test('multiple filter levels', async () => {
  const col = await initializeData()
  await expect(col.find({ a: 'hi', d: 5 }).toArray()).resolves.toHaveLength(1)
  await expect(
    col.find({ $and: [{ a: 'hi' }, { d: 5 }] }).toArray()
  ).resolves.toHaveLength(1)
  await expect(
    col.find({ a: 'hi', $and: [{ d: 5 }] }).toArray()
  ).resolves.toHaveLength(1)
  await expect(
    col.find({ a: 'hi', $and: [{ d: 10 }] }).toArray()
  ).resolves.toHaveLength(0)
  await expect(
    col.find({ a: 'hi', $or: [{ d: 10 }, { d: 5 }] }).toArray()
  ).resolves.toHaveLength(1)
})

afterAll(() => closeDb())
