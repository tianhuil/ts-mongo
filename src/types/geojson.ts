export type TsGeoJSON<Type> = Type extends TSGeoJSONTypes
  ? Type extends 'GeometryCollection'
    ? {
        type: Type
        geometries: TsGeoJSON<
          TsGeoJSONTypesNoGeometryCollection<TSGeoJSONTypes>
        >[]
      }
    : {
        type: Type
        coordinates: Type extends 'Point'
          ? TsLegacyCoordinates
          : Type extends 'MultiPoint'
          ? TsLegacyCoordinates[]
          : Type extends 'LineString'
          ? TsGeoJSONLine
          : Type extends 'MultiLineString'
          ? TsGeoJSONLine[]
          : Type extends 'Polygon'
          ? TsGeoJSONRing[]
          : Type extends 'MultiPolygon'
          ? TsGeoJSONRing[][]
          : never
      }
  : never

export type TsGeoJSONTypesNoGeometryCollection<TSGeoJSONTypes> =
  TSGeoJSONTypes extends 'GeometryCollection' ? never : TSGeoJSONTypes

export type TSGeoJSONTypes =
  | 'Point'
  | 'MultiPoint'
  | 'LineString'
  | 'MultiLineString'
  | 'Polygon'
  | 'MultiPolygon'
  | 'GeometryCollection'

export type TsGeoJSONLine = [
  TsLegacyCoordinates,
  TsLegacyCoordinates,
  ...TsLegacyCoordinates[]
]

export type TsGeoJSONRing = [
  TsLegacyCoordinates,
  TsLegacyCoordinates,
  TsLegacyCoordinates,
  TsLegacyCoordinates,
  ...TsLegacyCoordinates[]
]

export type TsLegacyCoordinates = [number, number]
