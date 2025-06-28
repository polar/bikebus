import * as G from "./GeoLibExt.ts";
import * as B from "../lib/BusInfo.ts"
import {getCumulativeDistanceAndDuration, Line, LineCoords} from "./GeoLibExt.ts";
import {getPreciseDistance} from "geolib";

export class GeoJSONProcessor {
    geojson: any
    name: string
    distanceThreshold: number = 32
    thresholdDegrees: number = 30
    minMetersPerSecond: number = 5

    constructor(name: string, geojson: any) {
        this.geojson = geojson
        this.name = name
    }

    getLines(ls: any) {
        if (ls) {
            return G.findStraightLines(ls.geometry.coordinates, this.thresholdDegrees)
        }
    }

    createPointFeature(coords : number[], timestamp : number){
        return {
            type: "Feature",
            properties: {
                timestamp: timestamp
            },
            geometry: {
                type: "Point",
                coordinates: coords
            }
        }
    }

    get startTime() {
        let ls = B.getBusInfoLineString(this.geojson)
        return ls?.properties?.timestamps[0]
    }
    get endTime() {
        let ls = B.getBusInfoLineString(this.geojson)
        return ls?.properties?.timestamps[ls?.properties?.timestamps.length - 1]
    }

    getMovingCumulative(minMetersPerSecond: number): number[] {
        let ls = B.getBusInfoLineString(this.geojson)
        return getCumulativeDistanceAndDuration(ls.geometry.coordinates, ls.properties.timestamps, minMetersPerSecond)// meters, duration(ms), average
    }

    getSummary() {
        let [distance, duration, _a, _m] = this.getMovingCumulative(this.minMetersPerSecond)
        return {
            distance: distance/1000,
            duration: duration/1000,
        }
    }

    createLineStringFeature(name: string, coords : number[][], timestamps?: number[]) {
        return ({
            type: "Feature",
            properties: {
                name: name,
                title: name,
                startTime: new Date(this.startTime).toLocaleTimeString(),
                endTime: new Date(this.endTime).toLocaleTimeString(),
                summary: this.getSummary(),
                timestamps: timestamps
            },
            geometry: {
                type: "LineString",
                coordinates: coords
            }
        })
    }

    raw() {
        let ls = B.getBusInfoLineString(this.geojson)
        if (ls) {
            let line = this.createLineStringFeature(this.name, ls.geometry.coordinates, ls.properties.timestamps)
            let start = this.createPointFeature(ls.geometry.coordinates[0], ls.properties.timestamps[0])
            let end = this.createPointFeature(ls.geometry.coordinates[ls.geometry.coordinates.length - 1], ls.properties.timestamps[ls.properties.timestamps.length - 1])
            return ({
                type: "FeatureCollection",
                features: [line, start, end]
            })
        }
    }

    refine() {
        let ls = B.getBusInfoLineString(this.geojson)
        if (ls) {
            let lines = this.getLines(ls) || []

            let reducedLines: Line[] = [lines[0]]
            let lastLine: Line = lines[0]
            for (let i = 1; i < lines.length; i++) {
                let line = lines[i]
                let distance = getPreciseDistance(ls.geometry.coordinates[lastLine.start], ls.geometry.coordinates[line.start])
                if (distance > this.distanceThreshold) {
                    reducedLines.push(line)
                }
                lastLine = line
            }
            let features: any[] = []
            let coords: LineCoords = []
            let timestamps = ls.properties?.timestamps ? [] : undefined
            reducedLines.forEach((l) => {
                coords = coords.concat(ls.geometry.coordinates.slice(l.start, l.end))
                features.push(this.createPointFeature(ls.geometry.coordinates[l.start], ls.properties?.timestamps[l.start]))
                if (ls.properties.timestamps)
                    timestamps = timestamps!.concat(ls.properties?.timestamps?.slice(l.start, l.end))
            })
            features.push(this.createPointFeature(ls.geometry?.coordinates[lastLine.end], ls.properties?.timestamps[lastLine.end]))
            return ({
                type: "FeatureCollection",
                features:
                    [this.createLineStringFeature(this.name, ls.geometry.coordinates, timestamps), ...features]
            })
        }
    }
}
