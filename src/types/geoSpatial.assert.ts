import * as ta from "type-assertions";
import { GeoSpatialQueryWithSingleOption } from "./geoSpatial";


type geoIntersectsExample = {
  $geoIntersects: {
    $geometry: {
      type: "Polygon";
      coordinates: [
        [
          [-73.99756, 40.73083],
          [-73.98913, 40.73083],
          [-73.98913, 40.73617],
          [-73.99756, 40.73617],
          [-73.99756, 40.73083]
        ]
      ];
    };
  };
};

// $geoWithin
type geoWithinGeometryExample = {
  $geoWithin: {
    $geometry: {
      type: "Polygon";
      coordinates: [
        [
          [-73.99756, 40.73083],
          [-73.98913, 40.73083],
          [-73.98913, 40.73617],
          [-73.99756, 40.73617],
          [-73.99756, 40.73083]
        ]
      ];
    };
  };
};
type geoWithinBoxExample = {
  $geoWithin: {
    $box: [[-73.99171, 40.738868], [-73.99171, 40.738868]];
  };
};
type geoWithinCenterExample = {
  $geoWithin: {
    $center: [[-73.99171, 40.738868], 0.0005];
  };
};

type geoWithinCenterSphereExample = {
  $geoWithin: {
    $centerSphere: [[-73.99171, 40.738868], 0.0005];
  };
};

type geoWithinPolygonExample = {
  $geoWithin: {
    $polygon: [
      [-73.99171, 40.738868],
      [-73.99171, 40.738868],
      [-73.99171, 40.738868],
      [-73.99171, 40.738868]
    ];
  };
};
// $near
type geoNearGeometryExample = {
  $near: {
    $geometry: {
      type: "Point";
      coordinates: [-73.9667, 40.78];
    };
  };
  $minDistance: 1000;
  $maxDistance: 5000;
};
type geoNearCoordinatesExample = {
  $near: [-73.9667, 40.78];
  $maxDistance: 5000;
};

// $nearSphere
type geoNearSphereGeometryExample = {
  $nearSphere: {
    $geometry: {
      type: "Point";
      coordinates: [-73.9667, 40.78];
    };
  };
  $minDistance: 1000;
  $maxDistance: 5000;
};

type geoNearSphereCoordinatesExample = {
  $nearSphere: [-73.9667, 40.78];
  $maxDistance: 5000;
  $minDistance: 1000;
};
type NearWithIntersectsExample = {
  $geoIntersects: {
    $geometry: {
      type: string;
      coordinates: number[][][];
    };
  };
  $near: {
    $geometry: {
      type: string;
      coordinates: number[];
    };
  };
};

ta.assert<ta.Not<ta.Extends<{}, GeoSpatialQueryWithSingleOption>>>(); // empty object
// $geoIntersects assertions
ta.assert<ta.Extends<geoIntersectsExample, GeoSpatialQueryWithSingleOption>>();
ta.assert<
  ta.Not<ta.Extends<NearWithIntersectsExample, GeoSpatialQueryWithSingleOption>>
>();
// geoWithin assertions
ta.assert<
  ta.Extends<geoWithinGeometryExample, GeoSpatialQueryWithSingleOption>
>();
ta.assert<ta.Extends<geoWithinBoxExample, GeoSpatialQueryWithSingleOption>>();
ta.assert<
  ta.Extends<geoWithinCenterExample, GeoSpatialQueryWithSingleOption>
>();
ta.assert<
  ta.Extends<geoWithinCenterSphereExample, GeoSpatialQueryWithSingleOption>
>();
ta.assert<
  ta.Extends<geoWithinPolygonExample, GeoSpatialQueryWithSingleOption>
>();

// $near assertions
ta.assert<
  ta.Extends<geoNearGeometryExample, GeoSpatialQueryWithSingleOption>
>();
ta.assert<
  ta.Extends<geoNearCoordinatesExample, GeoSpatialQueryWithSingleOption>
>();

// $nearSphere assertions
ta.assert<
  ta.Extends<geoNearSphereCoordinatesExample, GeoSpatialQueryWithSingleOption>
>();
ta.assert<
  ta.Extends<geoNearSphereGeometryExample, GeoSpatialQueryWithSingleOption>
>();

ta.assert<
  ta.Not<
    ta.Extends<
      {
        $near: [-73.99756, 40.73083];
        $nearSphere: [-73.99756, 40.73083];
        $maxDistance: 5000;
      },
      GeoSpatialQueryWithSingleOption
    >
  >
>();
ta.assert<
  ta.Not<
    ta.Extends<
      { $near: [-73.99756, 40.73083]; $minDistance: 1000 },
      GeoSpatialQueryWithSingleOption
    >
  >
>();
