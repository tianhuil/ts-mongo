
// A tuple containing longitude and latitude coordinates
 export type Coordinates = [number, number]

interface Near {
    type: 'Point'
    coordinates: Coordinates
}

export interface GeoNear<T = never>{
    /**
     * The point for which to find the closest documents.
     * - If using a 2dsphere index, you can specify the point as either a GeoJSON point or legacy coordinate pair.
     */
    near: Near
    /**
     * The maximum distance from the center point that the documents can be. MongoDB limits the results to those documents that fall within the specified distance from the center point.
     * Specify the distance in meters if the specified point is GeoJSON and in radians if the specified point is legacy coordinate pairs.
     */
    maxDistance?: number
    /**
     * The output field that contains the calculated distance. To specify a field within an embedded document, use dot notation.
     */
    distanceField:string
    /**
     * The minimum distance from the center point that the documents can be. MongoDB limits the results to those documents that fall outside the specified distance from the center point.
     * Specify the distance in meters for GeoJSON data and in radians for legacy coordinate pairs.
     */
    minDistance?:number
    /**
     * Determines how MongoDB calculates the distance between two points:
     * - When true, MongoDB uses $nearSphere semantics and calculates distances using spherical geometry.
     * - When false, MongoDB uses $near semantics: spherical geometry for 2dsphere indexes and planar geometry for 2d indexes.
     */
    spherical?: boolean
    /**
     * This specifies the output field that identifies the location used to calculate the distance. This option is useful when a location field contains multiple locations. To specify a field within an embedded document, use dot notation.
     */
    includeLocs?: string
    /**
     * The factor to multiply all distances returned by the query. For example, use the distanceMultiplier to convert radians, as returned by a spherical query, to kilometers by multiplying by the radius of the Earth.
     */
    distanceMultiplier?: number
    /**
     * Limits the results to the documents that match the query. The query syntax is the usual MongoDB read operation query syntax.
     * - You cannot specify a $near predicate in the query field of the $geoNear stage.
     */
    query?: T

}