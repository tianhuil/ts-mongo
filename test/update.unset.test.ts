import { mkTsTestCollection } from './util'

type Example = { a: { b: number; c?: string }; d: number }

const initializeData = async () => {
  const col = await mkTsTestCollection<Example>()
  const result = await col.insertOne({ a: { b: 2, c: 'hi' }, d: 5 })
  return [col, result.insertedId] as const
}

test('test unset on dot notation', async () => {
  const [col, id] = await initializeData()

  await col.findOneAndUpdate({ _id: id }, { $unset: { 'a.c': '' } })

  const result3 = await col.findOne({ _id: id })
  expect(result3).toStrictEqual({ _id: id, a: { b: 2 }, d: 5 })
})

test('test unset of object', async () => {
  const [col, id] = await initializeData()

  await col.findOneAndUpdate({ _id: id }, { $unset: { a: '' } })

  const result3 = await col.findOne({ _id: id })
  expect(result3).toStrictEqual({ _id: id, d: 5 })
})

test('test unset other key', async () => {
  const [col, id] = await initializeData()

  await col.findOneAndUpdate({ _id: id }, { $unset: { d: '' } })

  const result3 = await col.findOne({ _id: id })
  expect(result3).toStrictEqual({ _id: id, a: { b: 2, c: 'hi' } })
})
