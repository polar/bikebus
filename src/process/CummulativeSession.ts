// import {getPreciseDistance} from "geolib";
// import {GeolibGeoJSONPoint} from "geolib/es/types";
// import {SingleSession} from "./SingleSession.ts";
// import {findStraightLines, Line, LineCoords} from "./GeoLibExt.ts";
//
// export class CumulativeSession {
//     sessions: SingleSession[]
//     sessionId: string
//     route: string
//     startTime = 0
//     endTime = 0
//     coordinates: LineCoords
//     timestamps: number[]
//     name: string
//     constructor(sessions: SingleSession[]) {
//         this.sessions = sessions
//         this.sessionId = sessions[0].sessionId
//         this.route = sessions[0].route
//         this.name = `${this.route} - ${this.sessions.length} sessions`
//         this.startTime = sessions[0].startTime
//         this.endTime = sessions[sessions.length - 1].endTime
//         this.startTime = sessions[0].startTime
//         this.endTime = sessions[sessions.length - 1].endTime
//         this.coordinates = sessions.refine((a, b) => [...a, ...b.coordinates], [] as LineCoords)
//         this.timestamps = sessions.refine((a, b) => [...a, ...b.timestamps], [] as number[])
//     }
//
//     getMovingCumulative(minMetersPerSecond: number) : number[] {
//         let distance = 0
//         let duration = 0
//         for (let i = 0; i < this.sessions.length; i++) {
//             let session = this.sessions[i]
//             let [d, t, _a, _m] = session.getMovingCumulative(minMetersPerSecond)
//             distance += d
//             duration += t
//         }
//         return [distance, duration, duration > 0 ? distance/duration : Infinity, minMetersPerSecond]
//     }
//
//     getCumulative() {
//         return this.getMovingCumulative(0)
//     }
//
//     getSummary(minMetersPerSecond: number) {
//         let [distance, duration, _a, _m] = this.getMovingCumulative(minMetersPerSecond)
//         return {
//             distance: distance/1000,
//             duration: duration/1000,
//         }
//     }
//
//     getProperties(minMetersPerSecond: number) : any {
//         let lines = findStraightLines(this.coordinates, 20)
//         return {
//             session: this.sessionId,
//             title: this.route,
//             name: this.name,
//             numCoordinates: this.coordinates.length,
//             startTime: new Date(this.sessions[0].startTime).toTimeString(),
//             endTime: new Date(this.sessions[this.sessions.length - 1].endTime).toTimeString(),
//             duration: this.getSessionDuration(),
//             flyDistance: this.getFlyDistance(),
//             cumulative: this.getCumulative(),
//             moving: this.getMovingCumulative(minMetersPerSecond),
//             averageTimeDifference: this.getAverageTimeDifference(),
//             summary: this.getSummary(minMetersPerSecond),
//             numLines: lines.length,
//             lines: lines,
//         }
//     }
//
//     toLineFeature(line: any, color: string) {
//         return {
//             type: "Feature",
//             properties: {
//                 start: line.start,
//                 end: line.end,
//                 color: color,
//             },
//             geometry: {
//                 type: "LineString",
//                 coordinates: this.coordinates.slice(line.start, line.end)
//             }
//         }
//     }
//     toFeaturesCollection(minMetersPerSecond: number = 4) {
//         let features = []
//         for (let i = 0; i < this.sessions.length; i++) {
//             let session = this.sessions[i]
//             let feature = session.toFeatureCollection(minMetersPerSecond)
//             feature.features[0].properties.name = `${session.route}-${session.sessionId}`
//             features.push(session.toFeatureCollection(minMetersPerSecond))
//         }
//         return {
//             type: "FeatureCollection",
//             properties: this.getProperties(minMetersPerSecond),
//             features: features
//         }
//     }
//
//     toFeature(minMetersPerSecond: number = 4) {
//
//         return {
//             type: "Feature",
//             properties: Object.assign(this.getProperties(minMetersPerSecond), {timestamps:this.timestamps}),
//             geometry: {
//                 type: "LineString",
//                 coordinates: this.coordinates
//             }
//         }
//     }
//
//     toPointFeature(index: number, name: string) {
//         return {
//             type: "Feature",
//             properties: {
//                 index: index,
//                 name: name,
//             },
//             geometry: {
//                 type: "Point",
//                 coordinates: this.coordinates[index]
//             }
//         }
//     }
//     toPointFeatureForLine(ps: Line, color: string): {
//         type: "Feature";
//         properties: { start: number; end: number; color: string };
//         geometry: { type: string; coordinates: number[] }
//     } {
//         return {
//             type: "Feature",
//             properties: {
//                 start: ps.start,
//                 end: ps.end,
//                 color: color,
//             },
//             geometry: {
//                 type: "Point",
//                 coordinates: this.coordinates[ps.end-1]
//             }
//         }
//     }
//     hasCoordinates() {
//         return this.coordinates.length > 0
//     }
//     getFlyDistance() : number {
//         return this.sessions.refine((a, b) => a + b.getFlyDistance(), 0)
//     }
//     getSessionDuration() : number {
//         return this.sessions.refine((a, b) => a + b.getSessionDuration(), 0)
//     }
//     getAverageTimeDifference() : number {
//         return this.sessions.refine((a, b) => a + b.getAverageTimeDifference(), 0)/this.sessions.length
//     }
//
//     reduceLines(lines: Line[], distanceThreshold: number) {
//         if (lines.length < 1) {
//             return []
//         }
//         let reducedLines: Line[] = [lines[0]]
//         let lastLine: Line = lines[0]
//         for (let i = 1; i < lines.length; i++) {
//             let line = lines[i]
//             let distance = getPreciseDistance(this.coordinates[lastLine.start] as GeolibGeoJSONPoint, this.coordinates[line.start] as GeolibGeoJSONPoint)
//             if (distance > distanceThreshold) {
//                 reducedLines.push(line)
//             }
//             lastLine = line
//         }
//         return reducedLines
//     }
//     // @ts-ignore
//     toFeatureCollection(minMetersPerSecond: number = 4) {
//
//         // want to refine lines so that there are no clusters.
//
//         let [_pivots,lines,pivotSetions] = findPivotsByStraightLines(this.coordinates, this.timestamps, 3, 30, 80, 150)
//         // @ts-ignore
//         lines = this.reduceLines(lines, 30)
//         let lineFeatures = lines.map((l) => this.toLineFeature(l, "blue"))
//         let points = lines.map((l) => this.toPointFeature(l.start, "start"))
//         points = [this.toPointFeature(0, "start"), ...points, this.toPointFeature(this.coordinates.length - 1, "end")]
//
//         return {
//             type: "FeatureCollection",
//             features: points,
//         }
//     }
// }
// noinspection SpellCheckingInspection
