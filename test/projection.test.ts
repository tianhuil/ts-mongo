import z from 'zod'
import { mkTsTestCollection } from './util'

const Example = z.object({
  a: z.object({ b: z.number(), c: z.string() }),
  d: z.boolean(),
})
type Example = z.infer<typeof Example>

test('exclude with notation', async () => {
  const col = await mkTsTestCollection<Example>()

  await col.insertOne({ a: { b: 2, c: 's' }, d: true })
  const result = await col.unsafe.findOne({}, { projection: { 'a.b': 0 } })

  delete (result as any)._id

  expect(result).toEqual({ a: { c: 's' }, d: true })
})

test('exclude with dot notation', async () => {
  const col = await mkTsTestCollection<Example>()

  await col.insertOne({ a: { b: 2, c: 's' }, d: true })
  const result = await col.unsafe.findOne(
    {},
    { projection: { 'a.b': 0, 'a.c': 0 } }
  )

  delete (result as any)._id

  expect(result).toEqual({ a: {}, d: true })
})

test('exclude without dot notation', async () => {
  const col = await mkTsTestCollection<Example>()

  await col.insertOne({ a: { b: 2, c: 's' }, d: true })
  const result = await col.unsafe.findOne({}, { projection: { d: 0 } })

  delete (result as any)._id

  expect(result).toEqual({ a: { b: 2, c: 's' } })
})
