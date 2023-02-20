export type Coordinates = [number, number];

interface Geometry {
  crs?: {
    type: string;
    properties: {
      name: string;
    };
  };
}

export interface GeoJSONPoint extends Geometry {
  type: "Point";
  coordinates: Coordinates;
}

export interface GeoJSONLineString extends Geometry {
  type: "LineString";
  coordinates: Coordinates[];
}

export interface GeoJSONPolygon extends Geometry {
  type: "Polygon";
  coordinates: Coordinates[][];
}

export interface GeoJSONMultiPoint extends Geometry {
  type: "MultiPoint";
  coordinates: Coordinates[];
}

export interface GeoJSONMultiLineString extends Geometry {
  type: "MultiLineString";
  coordinates: Coordinates[][];
}

export interface GeoJSONMultiPolygon extends Geometry {
  type: "MultiPolygon";
  coordinates: Coordinates[][][];
}

export interface GeoJSONGeometryCollection extends Geometry {
  type: "GeometryCollection";
  geometries: GeoJSON[];
}

export type GeoJSON =
  | GeoJSONPoint
  | GeoJSONLineString
  | GeoJSONPolygon
  | GeoJSONMultiPoint
  | GeoJSONMultiLineString
  | GeoJSONMultiPolygon
  | GeoJSONGeometryCollection;
