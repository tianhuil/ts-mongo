import { ObjectId } from 'mongodb'
import { mkTsTestCollection } from './util'

type Example = { a: number; _id: ObjectId }

test('test set on dot notation', async () => {
  const col = await mkTsTestCollection<Example>()

  const _id = new ObjectId()
  const result = await col.insertOne({ a: 2, _id })
  expect(result.insertedId).toEqual(_id)
  expect(col.insertOne({ a: 2, _id })).rejects.toThrowError(
    /E11000 duplicate key error dup key/
  )
})
