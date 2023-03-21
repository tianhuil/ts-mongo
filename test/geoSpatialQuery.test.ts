import { TsLegacyCoordinates } from '../src/types/geojson'
import { mkTsTestCollection } from './util'

type Example = {
  Name: string
  City: string
  location: {
    type: 'Point'
    coordinates: TsLegacyCoordinates
  }
}

const locations: Example[] = [
  {
    Name: 'Houston Garden Center',
    City: 'LeagueCity',
    location: {
      type: 'Point',
      coordinates: [-73.856077, 40.848447],
    },
  },
  {
    Name: 'Lowes Garden Center',
    City: 'LeagueCity',
    location: {
      type: 'Point',
      coordinates: [-74.856077, 40.848447],
    },
  },
]
const initializeData = async () => {
  const col = await mkTsTestCollection<Example>()
  const result = await col.insertMany(locations)
  col.unsafe.createIndex({ 'location.coordinates': '2dsphere' })
  return [col, result.insertedIds] as const
}

test('geoWithin', async () => {
  const [col, id] = await initializeData()
  const result = await col.findOne({
    'location.coordinates': {
      $geoWithin: {
        $geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-74.856077, 40.848447],
              [-73.856077, 40.848447],
              [-73.856077, 41.848447],
              [-74.856077, 41.848447],
              [-74.856077, 40.848447],
            ],
          ],
        },
      },
    },
  })
  expect(result).toStrictEqual(locations[0])
})

describe('Near', () => {
  it('should find the closest location', async () => {
    const [col, id] = await initializeData()

    const result = await col
      .find({
        'location.coordinates': {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [-74.356077, 40.848447],
            },
          },
        },
      })
      .toArray()
    expect(result[0]).toStrictEqual(locations[1])
  })
})
