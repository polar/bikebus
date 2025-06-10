import {getPreciseDistance} from "geolib";
import {getCumulativeDistanceAndDuration, LineCoords} from "./GeoLibExt";

export class SingleSession {
    sessionId: string
    route: string
    startTime = 0
    endTime = 0
    coordinates: LineCoords = []
    timestamps: number[]
    deleteCalled: boolean = false
    constructor(sessionId: string, route: string) {
        this.route = route
        this.sessionId = sessionId
        this.coordinates = []
        this.timestamps = []
    }

    private getTimeDifferenceAt(index: number) : number {
        if (index == 0) {
            return 0
        }
        let prev = this.timestamps[index - 1]
        let curr = this.timestamps[index]
        return curr - prev // milliseconds
    }

    getAverageTimeDifference() : number {
        let timeDifference = 0
        for (let i = 0; i < this.timestamps.length; i++) {
            timeDifference += this.getTimeDifferenceAt(i)
        }
        return timeDifference/this.timestamps.length
    }

    getMovingCumulative(minMetersPerSecond: number) : number[] {
        return getCumulativeDistanceAndDuration(this.coordinates, this.timestamps, minMetersPerSecond)// meters, duration(ms), average
    }

    getCumulative() : number[] {
        return this.getMovingCumulative(0)
    }

    getSessionDuration() : number {
        return this.endTime - this.startTime
    }

    getFlyDistance() : number {
        return getPreciseDistance(this.coordinates[0], this.coordinates[this.coordinates.length - 1])
    }

    getSummary(minMetersPerSecond: number) {
        let [distance, duration, _a, _m] = this.getMovingCumulative(minMetersPerSecond)
        return {
            distance: distance/1000,
            duration: duration/1000,
        }
    }

    getProperties(minMetersPerSecond: number) : any {
        return {
            session: this.sessionId,
            title: this.route,
            numCoordinates: this.coordinates.length,
            startTime: new Date(this.startTime).toTimeString(),
            endTime: new Date(this.endTime).toTimeString(),
            deleteCalled: this.deleteCalled,
            duration: this.getSessionDuration(),
            flyDistance: this.getFlyDistance(),
            cumulative: this.getCumulative(),
            moving: this.getMovingCumulative(minMetersPerSecond),
            averageTimeDifference: this.getAverageTimeDifference(),
            summary: this.getSummary(minMetersPerSecond),
            timestamps: this.timestamps
        }
    }

    toFeature(minMetersPerSecond: number = 4) {
        return {
            type: "Feature",
            properties: this.getProperties(minMetersPerSecond),
            geometry: {
                type: "LineString",
                coordinates: this.coordinates
            }
        }
    }


    toFeatureCollection(minMetersPerSecond: number = 4) {
        return {
            type: "FeatureCollection",
            features: [this.toFeature(minMetersPerSecond)]
        }
    }

    hasCoordinates() {
        return this.coordinates.length > 0
    }
}
