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
  $box: [Coordinates, Coordinates];
  $center: [Coordinates, number];
  $centerSphere: [Coordinates, number];
  $polygon: Coordinates[];
}

/**
  A type that allows only one geospatial query option to be specified in a query.
  @template T - The type of the query options.
  @template K - The key of the allowed geospatial query option.
*/

type AllowOnlyOneOption<T, K> = {
  [Property in keyof T as Exclude<Property, K>]?: never;
};



/**
 * Type for $geoWithin query operator.
 * @see https://docs.mongodb.com/manual/reference/operator/query/geoWithin/
 * allowing only one of the options.
 */
type $geoWithin =
  | ({ $geometry: GeoJSONPolygon | GeoJSONMultiPolygon } & AllowOnlyOneOption<
      GeoWithinQueryOptions,
      "$geometry"
    >)
  | ({ $box: [Coordinates, Coordinates] } & AllowOnlyOneOption<
      GeoWithinQueryOptions,
      "$box"
    >)
  | ({ $center: [Coordinates, number] } & AllowOnlyOneOption<
      GeoWithinQueryOptions,
      "$center"
    >)
  | ({ $centerSphere: [Coordinates, number] } & AllowOnlyOneOption<
      GeoWithinQueryOptions,
      "$centerSphere"
    >)
  | ({ $polygon: Coordinates[] } & AllowOnlyOneOption<
      GeoWithinQueryOptions,
      "$polygon"
    >);

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


type GeoIntersects = {
  $geoIntersects: {
    $geometry: GeoJSONPolygon;
  };
} & AllowOnlyOneOption<GeoSpatialQueryOptions, "$geoIntersects">;

/**
 * The `GeoWithin` type describes a geospatial query option that uses the `$geoWithin` operator.
 * It can be used to specify a shape that contains the desired points, and it supports an optional
 * `allowance` field that determines how much deviation is acceptable from the specified shape.
 *
 * Note that the `GeoWithin` type cannot be combined with `maxDistance` or `minDistance` since these
 * options are specific to `$near` and `$nearSphere` operators. Attempting to use `maxDistance` or
 * `minDistance` with `$geoWithin` will result in a runtime error.
 */

type GeoWithin = {
  $geoWithin: $geoWithin;
  $maxDistance?: never;
  $minDistance?: never;
} & AllowOnlyOneOption<GeoSpatialQueryOptions, "$geoWithin">;

/**
 * The $near operator is a geospatial query operator that searches for documents where a location field is within a specified distance (in meters) from a given point. It returns documents sorted by distance from the specified point.
 *
 * To use the $near operator, you need to specify the $geometry field and the $maxDistance field within a $near object. The $geometry field specifies the point to search around, while the $maxDistance field specifies the maximum distance (in meters) from the point to search. Documents that are farther away than the specified distance will not be returned.
 *
 * This type includes a definition for a geospatial query using the $near operator, which includes the $geometry field and $maxDistance field. The type definition can be used in TypeScript code to ensure that the query is correctly formatted.
 *
 * Additionally, this type includes a definition of using the $near operator with legacy coordinates, which uses radians instead of meters for distance. In this case, the $maxDistance field specifies the maximum distance in radians from the center point.
 *
 * For more information on the $near operator, see the MongoDB documentation:
 * @see https://docs.mongodb.com/manual/reference/operator/query/near/
 *
 * To specify a point using legacy coordinates, $near requires a 2d index and has the following syntax:
 * {
 *   $near: [ <x>, <y> ],
 *   $maxDistance: <distance in radians>
 * }
 */
type Near =
  | ({
      $near: {
        $geometry: GeoJSONPoint;
        $maxDistance?: number;
        $minDistance?: number;
      };
    } & AllowOnlyOneOption<GeoSpatialQueryOptions, "$near">)
  | ({
      $near: Coordinates;
      $maxDistance?: number;
      $minDistance?: never;
    } & AllowOnlyOneOption<GeoSpatialQueryOptions, "$near">);

type NearSphere =
  | ({
      $nearSphere?: NearSphereGeometry;
    } & AllowOnlyOneOption<GeoSpatialQueryOptions, "$nearSphere">)
  | ({
      $nearSphere: Coordinates;
      $maxDistance?: number;
      $minDistance?: number;
    } & AllowOnlyOneOption<GeoSpatialQueryOptions, "$nearSphere">);

/**
 * Type for geo-spatial queries with a single option.
 *
 * This type defines the possible options for a geo-spatial query in MongoDB.
 * Only one option can be specified per query. The available options are:
 * - $geoIntersects
 * - $geoWithin
 * - $near
 * - $nearSphere
 * Takes <Field> as a generic parameter, which is the type of the field
 * being queried. If the field is a Coordinates type (i.e. [number, number]),
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

export type TsGeoSpatialQuery<Field> = Field extends Coordinates
  ? GeoIntersects | GeoWithin | Near | NearSphere
  : {};
