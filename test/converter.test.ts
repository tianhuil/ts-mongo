import { z } from 'zod'
import { mkTsCollection, WithTime } from '../src'
import { convertReadWriteCollection } from '../src/converter'
import { setupDb } from './util'

const Example = z.object({
  a: z.string(),
  b: z.number().optional(),
})
type Example = z.infer<typeof Example>

const requiredValue = 'fixed'

const initializeCollection = async () => {
  const db = await setupDb()

  const collection = convertReadWriteCollection(
    mkTsCollection<WithTime<Example>>(db, 'test-converter'),
    {
      preInsert: (obj) => {
        if (obj.a !== requiredValue) throw new Error('Error!')
        return obj
      },
      preUpdate: (obj) => obj,
      preReplace: (obj) => obj,
      postFind: (obj) => obj,
      preFilter: (obj) => obj,
    }
  )
  await collection.deleteMany({})
  return collection
}

test('insertOne passes', async () => {
  const collection = await initializeCollection()
  await expect(collection.insertOne({ a: requiredValue })).resolves.toBeTruthy()
})

test('insertOne fails', async () => {
  const collection = await initializeCollection()
  await expect(collection.insertOne({ a: 'another value' })).rejects.toThrow()
})
