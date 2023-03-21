import { TsGeoJSON, TSGeoJSONTypes, TsLegacyCoordinates } from './geojson'

export type WithGeoSpatialQueryOperator<Field> = Field extends
  | TsGeoJSON<TSGeoJSONTypes>
  | TsLegacyCoordinates
  ? {
      $geoIntersects?: {
        $geometry: TsGeoJSON<'Polygon'> | TsGeoJSON<'MultiPolygon'>
      }
      $geoWithin?:
        | { $geometry: TsGeoJSON<'Polygon'> | TsGeoJSON<'MultiPolygon'> }
        | WithGeoWithInPointOperators<Field>
    } & WithNearOperators<Field>
  : {}

export type WithNearOperators<Field> = Field extends
  | TsGeoJSON<'Point'>
  | TsLegacyCoordinates
  ? {
      $near?: TsGeoNear | TsLegacyCoordinates
      $nearSphere?: TsGeoNear | TsLegacyCoordinates
      $maxDistance?: number
      $minDistance?: number
    }
  : {}

export type WithGeoWithInPointOperators<Field> = Field extends
  | TsGeoJSON<'Point'>
  | TsLegacyCoordinates
  ?
      | { $box: TsGeoBox }
      | { $centerSphere: TsGeoCenter }
      | (Field extends TsLegacyCoordinates
          ? { $center: TsGeoCenter } | { $polygon: TsGeoLegacyPolygonCoords }
          : never)
  : never

export declare type TsGeoNear = {
  $geometry: TsGeoJSON<'Point'>
  $maxDistance?: number
  $minDistance?: number
}

export type TsGeoBox = [TsLegacyCoordinates, TsLegacyCoordinates]
export type TsGeoCenter = [TsLegacyCoordinates, number]

// The last point is always implicitly connected to the first. You can specify as many points, i.e. sides, as you like.
export type TsGeoLegacyPolygonCoords = [
  TsLegacyCoordinates,
  TsLegacyCoordinates,
  TsLegacyCoordinates,
  ...TsLegacyCoordinates[]
]
