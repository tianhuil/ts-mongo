import { addMiddleware } from '../src'
import { mkTsTestCollection } from './util'

type Example = { a: number }

const mkListeningCollection = async () => {
  const col = await mkTsTestCollection<Example>()

  const [before, after, callback] = [jest.fn(), jest.fn(), jest.fn()]
  addMiddleware(col, {
    handler:
      ({ originalMethod }) =>
      (...args) => {
        before(args)
        const result = originalMethod(...args)
        after(result)
        if (result?.then) {
          result?.then((val: any) => callback(val))
        }
        return result
      },
  })

  return { col, before, after, callback }
}

test('test listening on insertOne', async () => {
  const { col, before, after, callback } = await mkListeningCollection()
  const { insertedId } = await col.insertOne({ a: 2 })

  expect(before).toHaveBeenCalledTimes(1)
  expect(before).toHaveBeenCalledWith([{ a: 2, _id: insertedId }])
  expect(after).toHaveBeenCalledTimes(1)
  expect(callback).toHaveBeenCalledTimes(1)
})

test('test listening on find', async () => {
  const { col, before, after } = await mkListeningCollection()

  for await (const _ of col.find({})) {
  }
  expect(before).toHaveBeenCalledTimes(1)
  expect(before).toHaveBeenCalledWith([{}])
  expect(after).toHaveBeenCalledTimes(1)
})
