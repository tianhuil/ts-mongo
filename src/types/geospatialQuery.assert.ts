import * as ta from 'type-assertions'
import { FilterType, TsFilter } from './filter'
import { TsGeoJSON, TsLegacyCoordinates } from './geojson'
import {
  WithGeoSpatialQueryOperator,
  WithGeoWithInPointOperators,
  WithNearOperators,
} from './geospatialQuery'

// Test WithGeoWithInPointOperators
// Should accept all properties
ta.assert<
  ta.Extends<
    {
      $box: [[number, number], [number, number]]
    },
    WithGeoWithInPointOperators<TsLegacyCoordinates>
  >
>()

ta.assert<
  ta.Extends<
    {
      $centerSphere: [[number, number], number]
    },
    WithGeoWithInPointOperators<TsLegacyCoordinates>
  >
>()

ta.assert<
  ta.Extends<
    {
      $center: [[number, number], number]
    },
    WithGeoWithInPointOperators<TsLegacyCoordinates>
  >
>()

ta.assert<
  ta.Extends<
    {
      $polygon: [
        [number, number],
        [number, number],
        [number, number],
        [number, number]
      ]
    },
    WithGeoWithInPointOperators<TsLegacyCoordinates>
  >
>()

// $center is only valid for LegacyCoordinates Field
ta.assert<
  ta.Not<
    ta.Extends<
      {
        $center: [[number, number], number]
      },
      WithGeoWithInPointOperators<TsGeoJSON<'Point'>>
    >
  >
>()

// $polygon is only valid for LegacyCoordinates Field
ta.assert<
  ta.Not<
    ta.Extends<
      {
        $polygon: [[number, number], number]
      },
      WithGeoWithInPointOperators<TsGeoJSON<'Point'>>
    >
  >
>()

ta.assert<
  ta.Not<
    ta.Extends<
      {
        $near: 'Not Valid'
        $maxDistance: 5
      },
      WithNearOperators<TsGeoJSON<'Point'>>
    >
  >
>()

ta.assert<
  ta.Not<
    ta.Extends<
      {
        $near: 'Not Valid'
        $maxDistance: 5
      },
      WithNearOperators<TsGeoJSON<'Point'>>
    >
  >
>()

ta.assert<
  ta.Extends<
    {
      $geoIntersects: {
        $geometry: {
          type: 'Polygon'
          coordinates: [
            [
              [number, number],
              [number, number],
              [number, number],
              [number, number]
            ]
          ]
        }
      }
    },
    WithGeoSpatialQueryOperator<TsLegacyCoordinates>
  >
>()

// Only should accept Polygon & Multiline Polygon
ta.assert<
  ta.Not<
    ta.Extends<
      {
        $geoIntersects: {
          $geometry: {
            type: 'MultilineString'
            coordinates: [
              [
                [number, number],
                [number, number],
                [number, number],
                [number, number]
              ]
            ]
          }
        }
      },
      WithGeoSpatialQueryOperator<TsLegacyCoordinates>
    >
  >
>()

ta.assert<
  ta.Extends<
    {
      $geoIntersects: {
        $geometry: {
          type: 'MultiPolygon'
          coordinates: [
            [
              [
                [number, number],
                [number, number],
                [number, number],
                [number, number]
              ]
            ]
          ]
        }
      }
    },
    WithGeoSpatialQueryOperator<TsGeoJSON<'GeometryCollection'>>
  >
>()

// geoWithinGeometry test,
ta.assert<
  ta.Not<
    ta.Extends<
      {
        $geoWithin: {
          $geometry: {
            type: 'LineString'
            coordinates: [
              [number, number],
              [number, number],
              [number, number],
              [number, number]
            ]
          }
        }
      },
      WithGeoSpatialQueryOperator<TsGeoJSON<'Polygon'>>
    >
  >
>()

ta.assert<
  ta.Extends<
    {
      $geoWithin: {
        $geometry: {
          type: 'Polygon'
          coordinates: [
            [
              [number, number],
              [number, number],
              [number, number],
              [number, number]
            ]
          ]
        }
      }
    },
    WithGeoSpatialQueryOperator<TsGeoJSON<'Polygon'>>
  >
>()

// Test Filter
type Example = {
  a: TsGeoJSON<'Polygon'>
  b: {
    c: TsLegacyCoordinates
  }
  d: TsLegacyCoordinates
  e: TsGeoJSON<'Point'>
}

ta.assert<ta.Extends<TsLegacyCoordinates, FilterType<Example, 'b.c'>>>()

ta.assert<
  ta.Extends<
    {
      a: {
        $geoIntersects: {
          $geometry: {
            type: 'Polygon'
            coordinates: [[[0, 1], [0, 1], [0, 1], [0, 1]]]
          }
        }
      }
    },
    TsFilter<Example>
  >
>()

ta.assert<
  ta.Extends<
    {
      a: {
        $geoWithin: {
          $geometry: {
            type: 'Polygon'
            coordinates: [[[0, 1], [0, 1], [0, 1], [0, 1]]]
          }
        }
      }
    },
    TsFilter<Example>
  >
>()

// Flatten path, works for both any GeoJON & legacy points
ta.assert<
  ta.Extends<
    {
      'b.c': {
        $geoIntersects: {
          $geometry: {
            type: 'Polygon'
            coordinates: [[[0, 1], [0, 1], [0, 1], [0, 1]]]
          }
        }
      }
    },
    TsFilter<Example>
  >
>()

ta.assert<
  ta.Extends<
    {
      d: {
        $geoWithin: {
          $box: [[0, 1], [2, 5]]
        }
      }
    },
    TsFilter<Example>
  >
>()

// $center is only appliable to legacy coordinates, but 'e' is GeoJSON Point, so this should not work
ta.assert<
  ta.Not<
    ta.Extends<
      {
        e: {
          $geoWithin: {
            $center: [[0, 1], 2]
          }
        }
      },
      TsFilter<Example>
    >
  >
>()

// $box should only work with GeoJSON Point and Legacy Coordinates
ta.assert<
  ta.Not<
    ta.Extends<
      {
        a: {
          $geoWithin: {
            $box: [[0, 1], [2, 5]]
          }
        }
      },
      TsFilter<Example>
    >
  >
>()

// $centerSphere should only work with GeoJSON Point and Legacy Coordinates, But `a` is GeoJSON Polygon
ta.assert<
  ta.Not<
    ta.Extends<
      {
        a: {
          $geoWithin: {
            $centerSphere: [[0, 1], 2]
          }
        }
      },
      TsFilter<Example>
    >
  >
>()
