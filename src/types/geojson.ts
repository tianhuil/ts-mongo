export type TsGeoJSON<Type> = Type extends (TSGeoJSONTypes | "GeometryCollection")
  ? (Type extends "GeometryCollection"
    ? {
      type: Type,
      geometries: TsGeoJSON<TsGeoJSONTypesNoGeometryCollection<TSGeoJSONTypes>>[]
    }
    : {
      type: Type,
      coordinates: Type extends "Point"
      ? TsLegacyCoordinates
      : Type extends "MultiPoint"
      ? TsLegacyCoordinates[]
      : Type extends "LineString"
      ? TsGeoJSONLine
      : Type extends "MultiLineString"
      ? TsGeoJSONLine[]
      : Type extends "Polygon"
      ? TsGeoJSONRing[]
      : Type extends "MultiPolygon"
      ? TsGeoJSONRing[][]
      : never
    })
  : never

export type TsGeoJSONTypesNoGeometryCollection<TSGeoJSONTypes> = TSGeoJSONTypes extends "GeometryCollection" ? never : TSGeoJSONTypes

export type TSGeoJSONTypes =
  | "Point"
  | "MultiPoint"
  | "LineString"
  | "MultiLineString"
  | "Polygon"
  | "MultiPolygon"
  | "GeometryCollection"

export type TsGeoJSONLine = TsLegacyCoordinates[]
// export type TsGeoJSONLine = [TsGeoJSONCoordinates, TsGeoJSONCoordinates ...TsGeoJSONCoordinates[]]

export type TsGeoJSONRing = TsLegacyCoordinates[]
// export type TsGeoJSONRing = [TsGeoJSONCoordinates, TsGeoJSONCoordinates, TsGeoJSONCoordinates, TsGeoJSONCoordinates ...TsGeoJSONCoordinates[]]

export type TsLegacyCoordinates = number[]
// export type TsLegacyCoordinates = [number, number]
