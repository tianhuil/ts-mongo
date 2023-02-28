/**

Defines types for various GeoJSON objects used in geo-spatial queries.
These definitions are sourced from the official MongoDB documentation.
Reference: https://www.mongodb.com/docs/manual/reference/geojson/#std-label-geospatial-indexes-store-geojson.
*/



// A tuple containing longitude and latitude coordinates
export type Coordinates = [number, number];

// Base interface for all GeoJSON geometries, contains CRS (Coordinate Reference System) definition
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

// Union type that can represent any of the above GeoJSON objects
export type GeoJSON =
  | GeoJSONPoint
  | GeoJSONLineString
  | GeoJSONPolygon
  | GeoJSONMultiPoint
  | GeoJSONMultiLineString
  | GeoJSONMultiPolygon
  | GeoJSONGeometryCollection;
