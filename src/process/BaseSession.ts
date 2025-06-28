import {getCumulativeDistanceAndDuration, LineCoords} from "./GeoLibExt.ts";
import {getPreciseDistance} from "geolib";

export class BaseSession {
    sessionId: string
    route: string
    names: string[] = []
    coordinates: LineCoords = []
    timestamps: number[] = []
    deleteCalled: boolean = false

    get startTime() {
        return this.timestamps[0]
    }
    get endTime() {
        return this.timestamps[this.timestamps.length - 1]
    }

    constructor(sessionId: string, route: string, coordinates: LineCoords = [], timestamps: number[] = [], deleteCalled: boolean = false) {
        this.sessionId = sessionId
        this.route = route
        this.coordinates = coordinates
        this.timestamps = timestamps
        this.deleteCalled = deleteCalled
    }

    static combine(sessions: BaseSession[]): BaseSession {
        let combined = new BaseSession(sessions[0].sessionId, sessions[0].route)
        for (let i = 0; i < sessions.length; i++) {
            combined.addSession(sessions[i].coordinates, sessions[i].timestamps, sessions[i].names)
        }
        return combined
    }

    hasCoordinates() {
        return this.coordinates.length > 0
    }

    addCoordinate(payload: any) {
        if (payload.location) {
            this.coordinates.push([payload.location.longitude, payload.location.latitude])
            this.timestamps.push(payload.location.timestamp)
        } else {
            this.coordinates.push([payload.longitude, payload.latitude])
            this.timestamps.push(payload.timestamp)
        }
        this.names = this.names.includes(payload.sessionUser) ? this.names : [...this.names, payload.sessionUser]
        return this
    }

    addSession(coordinates: LineCoords, timestamps: number[], names: string[]) {
        if (this.coordinates.length != this.timestamps.length) {
            throw new Error("Malformed Session: Cannot add session with different lengths for coordinates and timestamps")
        }

        this.coordinates = this.coordinates. concat(coordinates)
        this.timestamps = this.timestamps.concat(timestamps)
        this.names = this.names.concat(names).reduce((a,b) => a.includes(b) ? a : [...a,b], [] as string[])
        return this
    }


    private getTimeDifferenceAt(index: number): number {
        if (index == 0) {
            return 0
        }
        let prev = this.timestamps[index - 1]
        let curr = this.timestamps[index]
        return curr - prev // milliseconds
    }

    getAverageTimeDifference(): number {
        let timeDifference = 0
        for (let i = 0; i < this.timestamps.length; i++) {
            timeDifference += this.getTimeDifferenceAt(i)
        }
        return timeDifference / this.timestamps.length
    }

    getMovingCumulative(minMetersPerSecond: number): number[] {
        return getCumulativeDistanceAndDuration(this.coordinates, this.timestamps, minMetersPerSecond)// meters, duration(ms), average
    }

    getCumulative(): number[] {
        return this.getMovingCumulative(0)
    }

    getSessionDuration(): number {
        return this.endTime - this.startTime
    }

    getFlyDistance(): number {
        return getPreciseDistance(this.coordinates[0], this.coordinates[this.coordinates.length - 1])
    }
}
