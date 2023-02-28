import * as ta from "type-assertions";
import { TsGeoSpatialQuery } from "./geoSpatial";
import { Coordinates } from "./geometry";

type location = [number, number];

/**
 * Example of a geospatial query using the $near operator to find documents that are near a given location.
 *
 * This query searches for documents where a location field is within a specified distance (in meters) from a given point.
 * The $near operator returns documents sorted by distance from the specified point.
 *
 * @see https://docs.mongodb.com/manual/reference/operator/query/near/
 *
 */
type geoNearExample = {
  $near: {
    $geometry: {
      type: "Point";
      coordinates: [number, number];
    };
    $maxDistance: number;
  };
};

ta.assert<ta.Extends<geoNearExample, TsGeoSpatialQuery<location>>>();
/**
 * When specifying a legacy coordinate, you can use the optional $maxDistance specification to limit the $near
  results by distance in radians. 
  $maxDistance limits the results to those documents that are at most the specified distance from the center point.
  @see https://docs.mongodb.com/manual/reference/operator/query/near/ 
  {
  $near: [ <x>, <y> ],
  $maxDistance: <distance in radians>
}
 */
ta.assert<
  ta.Not<
    ta.Extends<
      {
        $near: [123, 123];
        $minDistance: number;
      },
      TsGeoSpatialQuery<location>
    >
  >
>();
ta.assert<ta.Extends<geoNearExample, TsGeoSpatialQuery<location>>>();
ta.assert<
  ta.Not<
    ta.Extends<
      {
        $near: {
          $geometry: {
            type: "Polygon";
            coordinates: Coordinates[][]; // should be a point
          };
        };
      },
      TsGeoSpatialQuery<location>
    >
  >
>();

/**
 * Example of a geospatial query using the $geoWithin operator to find documents that are within a given polygon.
 *
 * This query searches for documents where a location field falls within the specified polygon defined by an array of coordinates.
 * The $geoWithin operator returns documents that fall completely within the polygon or intersect with it.
 *
 * @see https://www.mongodb.com/docs/manual/reference/operator/query/geoWithin/#within-a-polygon
 * @see https://www.mongodb.com/docs/manual/reference/operator/query/box/#mongodb-query-op.-box
 * @see https://www.mongodb.com/docs/manual/reference/operator/query/center/#mongodb-query-op.-center
 * @see https://www.mongodb.com/docs/manual/reference/operator/query/centerSphere/#mongodb-query-op.-centerSphere
 *
 */

type geoWithinExample = {
  $geoWithin: {
    $geometry: {
      type: "Polygon";
      coordinates: Coordinates[][];
    };
  };
};
type geoWithinBoxExample = {
  $geoWithin: {
    $box: [Coordinates, Coordinates];
  };
};
type geoWithinCenterExample = {
  $geoWithin: {
    $center: [Coordinates, number];
  };
};
type geoWithinCenterSphereExample = {
  $geoWithin: {
    $centerSphere: [Coordinates, number];
  };
};
ta.assert<ta.Extends<geoWithinExample, TsGeoSpatialQuery<location>>>();
ta.assert<ta.Extends<geoWithinExample, TsGeoSpatialQuery<location>>>();
ta.assert<
  ta.Not<
    ta.Extends<
      {
        $geoWithin: {
          $geometry: {
            type: "point";
            coordinates: number;
          };
        };
      },
      TsGeoSpatialQuery<location>
    >
  >
>();
ta.assert<ta.Extends<geoWithinBoxExample, TsGeoSpatialQuery<location>>>();
ta.assert<
  ta.Not<
    ta.Extends<
      {
        $geoWithin: {
          $box: Coordinates[]; // should be a tuple of 2 coordinates arrays [Coordinates, Coordinates]
        };
      },
      TsGeoSpatialQuery<location>
    >
  >
>();
ta.assert<ta.Extends<geoWithinCenterExample, TsGeoSpatialQuery<location>>>();
ta.assert<
  ta.Not<
    ta.Extends<
      {
        $geoWithin: {
          $center: [Coordinates]; // should be a tuple of 2 elements [Coordinates, radius]
        };
      },
      TsGeoSpatialQuery<location>
    >
  >
>();
ta.assert<
  ta.Extends<geoWithinCenterSphereExample, TsGeoSpatialQuery<location>>
>();
ta.assert<
  ta.Not<
    ta.Extends<
      {
        $geoWithin: {
          $center: [Coordinates]; // should be a tuple of 2 elements [Coordinates, radius]
        };
      },
      TsGeoSpatialQuery<location>
    >
  >
>();

/**

Example of a geospatial query using the $nearSphere operator to find documents that are near a given point.
This query searches for documents where a location field is within a certain distance from the specified point.
The $nearSphere operator returns documents in order of proximity to the specified point.
@see https://www.mongodb.com/docs/manual/reference/operator/query/nearSphere/#specify-center-point-using-geojson
*/

type nearSphereExample = {
  $nearSphere: {
    $geometry: {
      type: "Point";
      coordinates: Coordinates;
    };
    $minDistance: number;
    $maxDistance: number;
  };
};

ta.assert<ta.Extends<nearSphereExample, TsGeoSpatialQuery<location>>>();
ta.assert<
  ta.Not<
    ta.Extends<
      {
        $nearSphere: {
          $geometry: {
            type: "Point";
            coordinates: number;
          };
          $minDistance: number;
          $maxDistance: number;
        };
      },
      TsGeoSpatialQuery<location>
    >
  >
>();

/**
 * Example of a geospatial query using the $geoIntersects operator to find documents that intersect with a given shape.
 * This query searches for documents where a location field intersects with the specified shape.
 * The $geoIntersects operator returns documents that intersect with the specified shape.
 * @see https://www.mongodb.com/docs/manual/reference/operator/query/geoIntersects/#mongodb-query-op.-geoIntersects
 * @see https://www.mongodb.com/docs/manual/reference/operator/query/geometry/#mongodb-query-op.-geometry
 */

type geoIntersectsExample = {
  $geoIntersects: {
    $geometry: {
      type: "Polygon";
      coordinates: Coordinates[][];
    };
  };
};

ta.assert<ta.Extends<geoIntersectsExample, TsGeoSpatialQuery<location>>>();
ta.assert<
  ta.Not<
    ta.Extends<
      {
        $geoIntersects: {
          $geometry: {
            type: "Polygon";
            coordinates: number;
          };
        };
      },
      TsGeoSpatialQuery<location>
    >
  >
>();
