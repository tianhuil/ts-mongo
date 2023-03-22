import * as ta from 'type-assertions'
import {
  TsGeoJSON,
  TSGeoJSONTypes,
  TsGeoJSONTypesNoGeometryCollection,
} from './geojson'

// Test Geometry
ta.assert<
  ta.Extends<
    {
      type: 'Point'
      coordinates: [number, number]
    },
    TsGeoJSON<'Point'>
  >
>()

ta.assert<
  ta.Extends<
    {
      type: 'LineString'
      coordinates: [[number, number], [number, number]]
    },
    TsGeoJSON<'LineString'>
  >
>()

ta.assert<
  ta.Extends<
    {
      type: 'Polygon'
      coordinates: [
        [[number, number], [number, number], [number, number], [number, number]]
      ]
    },
    TsGeoJSON<'Polygon'>
  >
>()

ta.assert<
  ta.Extends<
    {
      type: 'MultiPoint'
      coordinates: [[number, number], [number, number]]
    },
    TsGeoJSON<'MultiPoint'>
  >
>()

ta.assert<
  ta.Extends<
    {
      type: 'MultiLineString'
      coordinates: [[[number, number], [number, number]]]
    },
    TsGeoJSON<'MultiLineString'>
  >
>()

ta.assert<
  ta.Extends<
    {
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
    },
    TsGeoJSON<'MultiPolygon'>
  >
>()

ta.assert<
  ta.Extends<
    {
      type: 'GeometryCollection'
      geometries: [
        {
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
      ]
    },
    TsGeoJSON<'GeometryCollection'>
  >
>()

ta.assert<
  ta.Extends<
    TsGeoJSONTypesNoGeometryCollection<TSGeoJSONTypes>,
    | 'Point'
    | 'MultiPoint'
    | 'LineString'
    | 'MultiLineString'
    | 'Polygon'
    | 'MultiPolygon'
  >
>()
