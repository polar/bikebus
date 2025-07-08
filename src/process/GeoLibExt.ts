
// noinspection SpellCheckingInspection

import {getPreciseDistance, getGreatCircleBearing} from "geolib"
import {GeolibGeoJSONPoint} from "geolib/es/types";

export interface Line {
    start: number
    end: number
    length: number
    threshold: number
    averageBearing: number
    angleDiff: number
}

/**
 * Returns the angle between two bearings, which are in degrees, 0 <= d < 360, 0 meaning north,
 * 90 means east, 270 means west, and 180 means south.
 *
 * @param bearing
 */
export function normalizeBearing(bearing: number) : number {
    let normalized = bearing % 360
    if (normalized < 0) {
        normalized += 360
    }
    return normalized
}

/**
 * Returns the angle difference between two bearings. Bearings are normalized to 0 <= d < 360 before calculating, and
 * the difference is normalized between -180 < d <= 180. A negative angle difference means b is left of a. A
 * positive difference means that b is "right" of a.
 * This means the difference between 359 and 1 is 2, not -358, and the difference between 1 and 359 is -2, not 358.
 * The difference between 1 and 181 is 180 (b is right of a), and the difference between 1 and 182 is -179 (b is left
 * of a).
 *
 * @param bearing1 The first bearing.
 * @param bearing2 The second bearing.
 * @returns The angle difference between the two bearings. A negative result means b is left of a.
 *
 * @example
 */

export function getAngleDifference(bearing1: number, bearing2: number): number {
    let a = normalizeBearing(bearing1)
    let b = normalizeBearing(bearing2)

    let c = normalizeBearing(b-a)
    return c > 180 ? c-360 : c
}

// noinspection GrazieInspection
/**
 * Find the average bearing of the route from all the bearings from the starting point to each point up to, but
 * not including the end. The default range is start = 0 and end = coordinates.length. The range may be
 * specified in reverse with the same constraints on the indexes, which for the entire route are
 * start = coordinates.length-1 and end = -1.
 * @param coordinates The coordinates of a route.
 * @param start The index of the starting coordinate in the given line. Default is 0.
 * @param end The up to, but not including index. Default is coordinates.length.
 */
export function findAverageBearing(coordinates: LineCoords, start: number = 0, end: number = coordinates.length) : number {
    let sum = 0
    if (start <= end) {
        let initial = coordinates[start] as GeolibGeoJSONPoint
        for (let i = start+1; i < end && i < coordinates.length; i++) {
            let point = coordinates[i]
            sum += getGreatCircleBearing(initial, point)
        }
    } else {
        let initial = coordinates[start] as GeolibGeoJSONPoint
        for (let i = start-1; i >= end && i >= 0; i--) {
            let point = coordinates[i] as GeolibGeoJSONPoint
            sum += getGreatCircleBearing(initial, point)
        }
    }
    return normalizeBearing(sum/Math.abs(end-start))
}

/**
 * Represents the geographical coordinates of a point.
 * This type alias refers to GeolibGeoJSONPoint, which is expected
 * to conform to the GeoJSON specification for point geometry.
 *
 * GeolibGeoJSONPoint typically includes longitude, latitude, and optionally
 * an altitude (elevation), representing a specific location on Earth.
 *
 * Usage of this type allows handling geospatial data in an efficient
 * and consistent way, particularly when working with geolocation libraries.
 */
export type PointCoords = GeolibGeoJSONPoint
/**
 * Represents the geographical coordinates of a line.
 * This type alias refers to PointCoords[], which is expected
 * to conform to the GeoJSON specification for line geometry.
 *
 * LineCoords typically is an array of PointCoords, representing
 * a sequence of points that define a straightish line.
 *
 * Usage of this type allows handling geospatial data in an efficient
 */
export type LineCoords = PointCoords[]

/**
 * Returns the cumulative distance and duration of a line from start, up to, but not including, end.
 *
 * @param coordinates The coordinates of a route.
 * @param timestamps The corresponding timestamps for each coordinate. Must be the same size as coordinates. If
 *                   not defined, duration will be calculated with minMetersPerSecond.
 * @param start The index of the starting coordinate in the given line.
 * @param end The up to, but not including index.
 * @param minMetersPerSecond The minimum speed for calculating duration, if no timestamps are available.
 */
export function getCumulativeDistanceAndDuration(coordinates: LineCoords, timestamps?: number[], start: number = 0, end: number = coordinates.length, minMetersPerSecond: number =3) : [number,number] {
    let sum = 0
    let dur = 0
    if (start <= end) {
        for (let i = start; i < end && i < coordinates.length - 1; i++) {
            let prev = coordinates[i]
            let next = coordinates[i + 1]
            let d = getPreciseDistance(prev, next)
            sum += d
            dur += timestamps && timestamps.length > i+1 ? timestamps[i + 1] - timestamps[i] : d * minMetersPerSecond*1000
        }
        return [sum, dur]
    }
    else {
        for (let i = start; i > end && i < coordinates.length; i--) {
            let prev = coordinates[i]
            let next = coordinates[i - 1]
            let d = getPreciseDistance(prev, next)
            sum += d
            dur += timestamps && timestamps.length > i ? timestamps[i] - timestamps[i - 1] : d * minMetersPerSecond*1000
        }
        return [sum, dur]
    }
}


/**
 * Returns the index from the first point of a line that is NOT at least the threshold from the average bearing of
 * the line from the start point up to that point. That is to say that the index returned is the first point of
 * the potential next line. That point is not inclusive of the implied line. If all the coordinates from the
 * start are within the threshold, the index returned is the length of the line.
 *
 * @param coordinates
 * @param start
 * @param thresholdDegrees
 */
export function findIndexOfStraightLine(coordinates: LineCoords, start: number, thresholdDegrees: number = 10) : number {
    if (start < coordinates.length-1) { // We need at least two points to calculate the bearing. Ignore the last point.
        let initial = coordinates[start]
        let bearingSum = getGreatCircleBearing(initial, coordinates[start + 1])
        let bearingCount = 1
        let bearingAverage = () => bearingSum / bearingCount
        for (let i = start + 1; i < coordinates.length; i++) {
            let point = coordinates[i]
            let lastPoint = coordinates[i - 1]
            let bearing1 = getGreatCircleBearing(lastPoint, point)
            let bearingInitial = getGreatCircleBearing(initial, point)
            let angleDiff = getAngleDifference(bearing1, bearingAverage())
            let initAngleDiff = getAngleDifference(bearing1, bearingInitial)
            if (Math.abs(angleDiff) > thresholdDegrees && Math.abs(initAngleDiff) > thresholdDegrees) {
                return i
            } else {
                bearingSum += bearingInitial
                bearingCount++
            }
        }
    }
    return coordinates.length
}

export function findStraightLines(coordinates: LineCoords, thresholdDegrees: number) : Line[] {
    let lines: any[] = []
    for (let i = 0; i < coordinates.length;) {
        let line = findIndexOfStraightLine(coordinates, i, thresholdDegrees)
        if (line != coordinates.length) {
            let start = i
            let end = line
            let average = findAverageBearing(coordinates, start, end)
            let angleDiff = getAngleDifference(average, getGreatCircleBearing(coordinates[start], coordinates[end]))
            lines.push({
                start: start,
                end: end,
                length: end - start,
                threshold: thresholdDegrees,
                averageBearing: average,
                angleDiff: angleDiff
            })
        }
        i = line
    }
    return lines
}
