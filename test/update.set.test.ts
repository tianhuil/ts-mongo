import { mkTsTestCollection } from './util'

type Example = { a: { b: number; c?: string }; d: number }

const initializeData = async () => {
  const col = await mkTsTestCollection<Example>()
  const result = await col.insertOne({ a: { b: 2, c: 'hi' }, d: 5 })
  return [col, result.insertedId] as const
}

test('test set on dot notation', async () => {
  const [col, id] = await initializeData()

  await col.findOneAndUpdate({ _id: id }, { $set: { 'a.c': 'bye' } })

  const result3 = await col.findOne({ _id: id })
  expect(result3).toStrictEqual({ _id: id, a: { b: 2, c: 'bye' }, d: 5 })
})

test('test set of object', async () => {
  const [col, id] = await initializeData()

  await col.findOneAndUpdate({ _id: id }, { $set: { a: { b: 3 } } })

  const result3 = await col.findOne({ _id: id })
  expect(result3).toStrictEqual({ _id: id, a: { b: 3 }, d: 5 })
})

test('test set other key', async () => {
  const [col, id] = await initializeData()

  await col.findOneAndUpdate({ _id: id }, { $set: { d: 10 } })

  const result3 = await col.findOne({ _id: id })
  expect(result3).toStrictEqual({ _id: id, a: { b: 2, c: 'hi' }, d: 10 })
})
