import {BaseSession} from "./BaseSession.ts";
import {findStraightLines, Line, LineCoords} from "./GeoLibExt.ts";
import {getPreciseDistance} from "geolib";

export class SessionGeoJSONBuilder extends BaseSession {
    session : BaseSession
    minMetersPerSecond: number = 5
    straightLineThreshold: number = 20
    minLineLength: number = 4
    distanceThreshold: number = 100

    constructor(opts: any) {
        super(opts.session.sessionId, opts.session.route)
        this.session = opts.session;
        this.route = this.session.route;
        this.sessionId = this.session.sessionId;
        this.coordinates = [...this.session.coordinates];
        this.timestamps = [...this.session.timestamps];
        this.deleteCalled = this.session.deleteCalled;
        this.minMetersPerSecond = opts.minMetersPerSecond !== undefined ? opts.minMetersPerSecond : this.minMetersPerSecond;
        this.straightLineThreshold = opts.straightLineThreshold !== undefined ? opts.straightLineThreshold : this.straightLineThreshold;
        this.minLineLength = opts.minLineLength !== undefined ? opts.minLineLength : this.minLineLength;
        this.distanceThreshold = opts.distanceThreshold !== undefined ? opts.distanceThreshold : this.distanceThreshold;
    }

    getSummary() {
        let [distance, duration, _a, _m] = this.getMovingCumulative(this.minMetersPerSecond)
        return {
            distance: distance/1000,
            duration: duration/1000,
        }
    }


    getProperties() : any {
        return {
            session: this.sessionId,
            title: this.route,
            numCoordinates: this.coordinates.length,
            startTime: new Date(this.startTime).toTimeString(),
            endTime: new Date(this.endTime).toTimeString(),
            duration: this.getSessionDuration(),
            flyDistance: this.getFlyDistance(),
            cumulative: this.getCumulative(),
            moving: this.getMovingCumulative(this.minMetersPerSecond),
            averageTimeDifference: this.getAverageTimeDifference(),
            summary: this.getSummary(),
            deleteCalled: this.deleteCalled,
            timestamps: this.timestamps
        }
    }

    private getLines() {
        return findStraightLines(this.coordinates, this.straightLineThreshold)
    }

    getLineString() {
        return {
            type: "Feature",
            properties: {
                name: this.route,
                sessionId: this.sessionId,
                numCoordinates: this.coordinates.length,
                startTime: new Date(this.startTime).toTimeString(),
                endTime: new Date(this.endTime).toTimeString(),
                duration: this.getSessionDuration(),
                flyDistance: this.getFlyDistance(),
                summary: this.getSummary(),
                deleteCalled: this.deleteCalled,
            },
            geometry: {
                type: "LineString",
                coordinates: this.coordinates
            }
        }
    }

    getPointFeature(line: Line) {
        return {
            type: "Feature",
            properties: {
                start: line.start,
                end: line.end,
            },
            geometry: {
                type: "Point",
                coordinates: this.coordinates[line.start]
            }
        }
    }

    toGeoJSON() {
        let lines = this.getLines()
        let points = lines.map((l) => this.getPointFeature(l))
        return {
            type: "FeatureCollection",
            properties: this.getProperties(),
            features: [this.getLineString(), ...points]
        }
    }

    reduce() {
        let lines = this.getLines()
        if (lines.length < 1) {
            let session = new BaseSession(this.sessionId, this.route, this.coordinates, this.timestamps, this.deleteCalled)
            return new SessionGeoJSONBuilder({session: session, minMetersPerSecond: this.minMetersPerSecond, straightLineThreshold: this.straightLineThreshold, minLineLength: this.minLineLength, distanceThreshold: this.distanceThreshold})
        }
        let reducedLines: Line[] = [lines[0]]
        let lastLine: Line = lines[0]
        for (let i = 1; i < lines.length; i++) {
            let line = lines[i]
            let distance = getPreciseDistance(this.coordinates[lastLine.start], this.coordinates[line.start])
            if (distance > this.distanceThreshold) {
                reducedLines.push(line)
            }
            lastLine = line
        }
        let coords : LineCoords = []
        let timestamps : number[] = []
        reducedLines.forEach((l) => {
            coords = coords.concat(this.coordinates.slice(l.start, l.end))
            timestamps = timestamps.concat(this.timestamps.slice(l.start, l.end))

        })
        let session = new BaseSession(this.sessionId, this.route, this.coordinates, this.timestamps, this.deleteCalled)
        return new SessionGeoJSONBuilder({session: session, minMetersPerSecond: this.minMetersPerSecond, straightLineThreshold: this.straightLineThreshold, minLineLength: this.minLineLength, distanceThreshold: this.distanceThreshold})
    }

}
