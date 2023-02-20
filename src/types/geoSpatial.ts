import {
  GeoJSONPolygon,
  GeoJSONPoint,
  GeoJSONMultiPolygon,
  Coordinates,
} from "./geometry";

/**
 * Options for $geoWithin.
 */
interface GeoWithinQueryOptions {
  $geometry: GeoJSONPolygon | GeoJSONMultiPolygon;
  $box: Coordinates[];
  $center: [Coordinates, number];
  $centerSphere: [Coordinates, number];
  $polygon: Coordinates[];
}
/**
 * Type for $geoWithin query operator.
 * @see https://docs.mongodb.com/manual/reference/operator/query/geoWithin/
 * allowing only one of the options.
 */
type $geoWithin = (
  | { $geometry: GeoJSONPolygon | GeoJSONMultiPolygon }
  | { $box: Coordinates[] }
  | { $center: [Coordinates, number] }
  | { $centerSphere: [Coordinates, number] }
  | { $polygon: Coordinates[] }
) & {
  [$key in keyof GeoWithinQueryOptions as Exclude<
    $key,
    "$geometry" | "$box" | "$center" | "$centerSphere" | "$polygon"
  >]?: never;
};
/**
 * Options for $nearSphere query operator.
 * @see https://docs.mongodb.com/manual/reference/operator/query/nearSphere/
 */
interface NearSphereGeometry {
  $geometry: GeoJSONPoint;
  $maxDistance?: number;
  $minDistance?: number;
}

/**
 * Interface for defining a GeoSpatial query with various options.
 *
 * @see https://www.mongodb.com/docs/manual/reference/operator/query-geospatial/
 */

interface GeoSpatialQueryOptions {
  $geoIntersects: {
    $geometry: GeoJSONPolygon;
  };
  $geoWithin: $geoWithin;
  $near:
    | Coordinates
    | {
        $geometry: GeoJSONPoint;
      };
  $nearSphere: NearSphereGeometry | Coordinates;
}

/**
 * Type for geo-spatial queries with a single option.
 *
 * This type defines the possible options for a geo-spatial query in MongoDB.
 * Only one option can be specified per query. The available options are:
 * - $geoIntersects
 * - $geoWithin
 * - $near
 * - $nearSphere
 *
 * The $maxDistance option can be used with $near and $nearSphere, and the
 * $minDistance option can only be used with $nearSphere.
 *
 * @see https://docs.mongodb.com/manual/reference/operator/query-geospatial/
 *
 * @example
 * ```
 * const query: GeoSpatialQueryWithSingleOption = {
 *   $geoWithin: {
 *     $geometry: {
 *       type: "Polygon",
 *       coordinates: [[[-73.99756, 40.73083], [-73.98913, 40.73083], [-73.98913, 40.73617], [-73.99756, 40.73617], [-73.99756, 40.73083]]]
 *     }
 *   }
 * };
 * ```
 */

export type GeoSpatialQueryWithSingleOption = (
  | {
      $geoIntersects: {
        $geometry: GeoJSONPolygon;
      };
      $maxDistance?: never;
      $minDistance?: never;
    }
  | { $geoWithin: $geoWithin; $maxDistance?: never; $minDistance?: never }
  | {
      $near: Coordinates;
      $maxDistance?: number;
      $minDistance?: never;
      $nearSphere?: never;
    }
  | {
      $near: {
        $geometry: GeoJSONPoint;
      };
      $maxDistance?: number;
      $minDistance?: number;
      $nearSphere?: never;
    }
  | {
      $nearSphere: NearSphereGeometry | Coordinates;
      $maxDistance?: number;
      $minDistance?: number;
      $near?: never;
    }
) & {
  [$key in keyof GeoSpatialQueryOptions as Exclude<
    $key,
    | "$geoIntersects"
    | "$geoWithin"
    | "$near"
    | "$nearSphere"
    | "$maxDistance"
    | "$minDistance"
  >]?: never;
};

