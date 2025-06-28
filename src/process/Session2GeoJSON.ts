//
// import fs from "node:fs"
//
// import {FileHandle, open} from "node:fs/promises"
// import {getPreciseDistance, getGreatCircleBearing} from "geolib"
// import {GeolibGeoJSONPoint} from "geolib/es/types";
//
// function getAngleDifference(bearing1: number, bearing2: number): number {
//     let diff = bearing2 - bearing1;
//
//     // Normalize to -180 to 180 degrees
//     if (diff > 180) {
//         diff -= 360;
//     } else if (diff < -180) {
//         diff += 360;
//     }
//     return diff;
// }
//
// function findAverageBearing(coordinates: number[][],start: number, end: number) : number {
//     let sum = 0
//     if (start <= end) {
//         let initial = coordinates[start] as GeolibGeoJSONPoint
//         for (let i = start+1; i < end && i < coordinates.length; i++) {
//             let point = coordinates[i] as GeolibGeoJSONPoint
//             sum += getGreatCircleBearing(initial, point)
//         }
//     }
//     else {
//         let initial = coordinates[start] as GeolibGeoJSONPoint
//         for (let i = start-1; i >= end && i >= 0; i--) {
//             let point = coordinates[i] as GeolibGeoJSONPoint
//             sum += getGreatCircleBearing(initial, point)
//         }
//     }
//     return sum/Math.abs(end-start)
// }
//
// function findIndexOfStraightLine(coordinates: number[][], start: number, threshholdDegrees: number = 10) : number {
//     let initial = coordinates[start] as GeolibGeoJSONPoint
//     let bearingSum = getGreatCircleBearing(initial, coordinates[start + 1] as GeolibGeoJSONPoint)
//     let bearingCount = 1
//     let bearingAverage = () => bearingSum/bearingCount
//     for (let i = start+2; i < coordinates.length-1; i++) {
//         let point = coordinates[i] as GeolibGeoJSONPoint
//         let lastPoint = coordinates[i-1] as GeolibGeoJSONPoint
//         let bearing1 = getGreatCircleBearing(lastPoint, point)
//         let bearingInitial = getGreatCircleBearing(initial, point)
//         let angleDiff = getAngleDifference(bearing1, bearingAverage())
//         let initAngleDiff = getAngleDifference(bearing1, bearingInitial)
//         if (Math.abs(angleDiff) > threshholdDegrees && Math.abs(initAngleDiff) > threshholdDegrees) {
//             return i
//         } else {
//             bearingSum += bearing1
//             bearingCount++
//         }
//     }
//     return coordinates.length
// }
//
// function findStraightLines(coordinates: number[][], thresholdDegrees: number) : Line[] {
//     let lines: any[] = []
//     for (let i = 0; i < coordinates.length - 1;) {
//         let line = findIndexOfStraightLine(coordinates, i, thresholdDegrees)
//         if (line != coordinates.length) {
//             let start = i
//             let end = line
//             let average = findAverageBearing(coordinates, start, end)
//             let angleDiff = getAngleDifference(average, getGreatCircleBearing(coordinates[start] as GeolibGeoJSONPoint, coordinates[end] as GeolibGeoJSONPoint))
//             lines.push({
//                     start: start,
//                     end: end,
//                 length: end - start,
//                     averageBearing: average,
//                     angleDiff: angleDiff
//                 })
//         }
//         i = line
//     }
//     return lines
// }
// interface Line {
//     start: number
//     end: number
//     length: number
//     averageBearing: number
//     angleDiff: number
// }
// function findPivotSections(lines: any[], lineThreshold: number) : Line[] {
//     let pivotSections = []
//     let pivotSection: any = {}
//
//     for(let i = 0; i < lines.length; i++) {
//         let line = lines[i]
//         if (line.length < lineThreshold) {
//             if (pivotSection.start == null) {
//                 pivotSection.start = line.start
//                 pivotSection.end = line.end
//                 pivotSection.length = line.length
//             } else {
//                 pivotSection.end = line.end
//                 pivotSection.length += line.length
//             }
//         } else {
//             if (pivotSection.start != null) {
//                 pivotSections.push(pivotSection)
//                 pivotSection = {}
//             }
//         }
//     }
//     if (pivotSection.start != null) {
//         pivotSections.push(pivotSection)
//     }
//     return pivotSections
// }
//
// interface Pivot {
//     type: 'Left' | 'Right' | 'U-Turn' | undefined;
//     start: number
//     pivot: number
//     end: number
//     bearingIn: number
//     bearingOut: number
//     angleChange: number
//     cumulativeFromStart: [number, number]
//     cumulativeToeEnd: [number, number]
//     cumulativeStartToEnd: [number, number]
//     flyDistanceFromStart: number
//     flyDistanceToEnd: number
//     flyDistance: number
//     coordinates: number[]
//     timestamp: number
//     cumulativeTrip: [number, number]
// }
//
// interface PivotSection {
//     start: number
//     end: number
//     length: number
// }
// function findPivotsByStraightLines(coordinates: number[][], timestamps: number[], lineCountThreshold: number, lineThresholdBearing: number, turnThreshold: number, uTurnThreaholdDegress: number) : [Pivot[], Line[], PivotSection[]] {
//     let lines : Line[] = findStraightLines(coordinates, lineThresholdBearing)
//     let pivots: Pivot[] = []
//     let pivotSections: PivotSection[] = findPivotSections(lines, lineCountThreshold)
//
//     // for (let i = 0; i < pivotSections.length; i++) {
//     //     let  ps = pivotSections[i]
//     //     for (let j = ps.start; j < ps.end; ) {
//     //         let pivot = findIndexInThreshold(coordinates, j, ps.end, turnThreshold)
//     //         if (pivot != null) {
//     //             let start = ps.start
//     //             let end = start + (pivot - start) * 2 // pivot may be x.5
//     //             pivot = Math.floor(pivot)
//     //             let prev = coordinates[start] as GeolibGeoJSONPoint
//     //             let curr = coordinates[pivot] as GeolibGeoJSONPoint
//     //             let next = coordinates[end] as GeolibGeoJSONPoint
//     //             let bearingIn = getGreatCircleBearing(prev, curr)
//     //             let bearingOut = getGreatCircleBearing(curr, next)
//     //             let turnType: 'Left' | 'Right' | 'U-Turn' | undefined;
//     //             let angleChange = getAngleDifference(bearingIn, bearingOut)
//     //             if (Math.abs(angleChange)) {
//     //                 if (Math.abs(angleChange) >= uTurnThreaholdDegress) {
//     //                     turnType = 'U-Turn';
//     //                 } else if (angleChange > 0) {
//     //                     turnType = 'Right';
//     //                 } else {
//     //                     turnType = 'Left';
//     //                 }
//     //             }
//     //             pivots.push({
//     //                 type: turnType,
//     //                 start: start,
//     //                 pivot: pivot,
//     //                 end: end,
//     //                 bearingIn: bearingIn,
//     //                 bearingOut: bearingOut,
//     //                 angleChange: angleChange,
//     //                 cumulativeFromStart: getCumulative(coordinates, timestamps, start, pivot),
//     //                 cumulativeToeEnd: getCumulative(coordinates, timestamps, pivot, end),
//     //                 cumulativeStartToEnd: getCumulative(coordinates, timestamps, start, end),
//     //                 flyDistanceFromStart: getPreciseDistance(coordinates[start] as GeolibGeoJSONPoint, coordinates[pivot] as GeolibGeoJSONPoint) / 1000,
//     //                 flyDistanceToEnd: getPreciseDistance(coordinates[pivot] as GeolibGeoJSONPoint, coordinates[end] as GeolibGeoJSONPoint),
//     //                 flyDistance: getPreciseDistance(coordinates[start] as GeolibGeoJSONPoint, coordinates[end] as GeolibGeoJSONPoint),
//     //                 coordinates: coordinates[pivot],
//     //                 timestamp: timestamps[pivot],
//     //                 cumulativeTrip: getCumulative(coordinates, timestamps, 0, end)
//     //             })
//     //             j = end
//     //         } else {
//     //             j = ps.end // ends loop
//     //         }
//     //     }
//     // }
//     return [pivots, lines.filter(l => l.length >= lineCountThreshold), pivotSections]
// }
//
// function findIndexInThreshold(coordinates: number[][], start: number, end: number, thresholdDegrees: number) : number | null {
//     let bearingIn = getGreatCircleBearing(coordinates[start] as GeolibGeoJSONPoint, coordinates[start + 1] as GeolibGeoJSONPoint)
//
//     for (let i = start+1; i < end && i < coordinates.length -1; i++) {
//         let average = findAverageBearing(coordinates, start, i)
//         let angleDiff = getAngleDifference(bearingIn, average)
//         if (Math.abs(angleDiff) >= thresholdDegrees/2) {
//             let reverseBearingIn = getGreatCircleBearing(coordinates[i] as GeolibGeoJSONPoint, coordinates[i - 1] as GeolibGeoJSONPoint)
//             for(let j = i-1; j > start; j--) {
//                 let avg = findAverageBearing(coordinates, i, j)
//                 let angleDiff2 = getAngleDifference(avg, reverseBearingIn)
//                 if (Math.abs(angleDiff2) >= thresholdDegrees/2) {
//                     return start + (j-start)/2
//                 }
//             }
//         }
//     }
//     return null
// }
//
// function getCumulative(coordinates: number[][], timestamps: number[], start: number, end: number) : [number,number] {
//     let sum = 0
//     let dur = 0
//     if (start <= end) {
//         for (let i = start; i < end && i < coordinates.length - 1; i++) {
//             let prev = coordinates[i] as GeolibGeoJSONPoint
//             let next = coordinates[i + 1] as GeolibGeoJSONPoint
//             sum += getPreciseDistance(prev, next)
//             dur += timestamps[i + 1] - timestamps[i]
//         }
//         return [sum, dur]
//     }
//     else {
//         for (let i = start; i > end && i < coordinates.length; i--) {
//             let prev = coordinates[i] as GeolibGeoJSONPoint
//             let next = coordinates[i - 1] as GeolibGeoJSONPoint
//             sum += getPreciseDistance(prev, next)
//             dur += timestamps[i] - timestamps[i - 1]
//         }
//         return [sum, dur]
//     }
// }
//
// // @ts-ignore
// function findPivotsInCoordinates(coordinates: number[][], timestamps: number[],  thresholdDegrees: number, uTurnThresholdDegrees: number) : any[] {
//     let pivots: any[] = []
//     for (let i = 0; i < coordinates.length - 2;) {
//         let line = findIndexOfStraightLine(coordinates, i)
//         if (line == coordinates.length) {
//             return pivots
//         }
//         let pivot = findIndexInThreshold(coordinates, line, coordinates.length-3, thresholdDegrees)
//         if (pivot != null) {
//             let start = line
//             let end = start + (pivot-start)*2 // pivot may be x.5
//             pivot = Math.floor(pivot)
//             let prev = coordinates[start] as GeolibGeoJSONPoint
//             let curr = coordinates[pivot] as GeolibGeoJSONPoint
//             let next = coordinates[end ] as GeolibGeoJSONPoint
//             let bearingIn = getGreatCircleBearing(prev, curr)
//             let bearingOut = getGreatCircleBearing(curr, next)
//             let turnType: 'Left' | 'Right' | 'U-Turn' | undefined;
//             let angleChange = getAngleDifference(bearingIn, bearingOut)
//             if (Math.abs(angleChange)) {
//                 if (Math.abs(angleChange) >= uTurnThresholdDegrees) {
//                     turnType = 'U-Turn';
//                 } else if (angleChange > 0) {
//                     turnType = 'Right';
//                 } else {
//                     turnType = 'Left';
//                 }
//             }
//             pivots.push({
//                 type: turnType,
//                 start: start,
//                 pivot: pivot,
//                 end: end,
//                 bearingIn: bearingIn,
//                 bearingOut: bearingOut,
//                 angleChange: angleChange,
//                 cumulativeFromStart: getCumulative(coordinates, timestamps, start, pivot),
//                 cumulativeToeEnd: getCumulative(coordinates, timestamps, pivot, end),
//                 cumulativeStartToEnd: getCumulative(coordinates, timestamps, start, end),
//                 flyDistanceFromStart: getPreciseDistance(coordinates[start] as GeolibGeoJSONPoint, coordinates[pivot] as GeolibGeoJSONPoint)/1000,
//                 flyDistanceToEnd: getPreciseDistance(coordinates[pivot] as GeolibGeoJSONPoint, coordinates[end] as GeolibGeoJSONPoint),
//                 flyDistance: getPreciseDistance(coordinates[start] as GeolibGeoJSONPoint, coordinates[end] as GeolibGeoJSONPoint),
//                 coordinates: coordinates[pivot],
//                 timestamp: timestamps[pivot],
//                 cumulativeTrip: getCumulative(coordinates, timestamps, 0,end)
//             })
//             i = end
//         } else {
//             return pivots
//         }
//     }
//     return pivots
// }
//
// function findTurnsInCoordinates(timestamps: number[], coordinates: number[][], turnThresholdDegrees: number, uTurnThresholdDegrees: number) : any[] {
//     let turns: any[] = []
//     if (coordinates.length < 3) {
//         return turns
//     }
//
//     for (let i = 1; i < coordinates.length - 2; i++) {
//         let prev = coordinates[i-1] as GeolibGeoJSONPoint
//         let curr = coordinates[i] as GeolibGeoJSONPoint
//         let next = coordinates[i + 1] as GeolibGeoJSONPoint
//         let bearingIn = getGreatCircleBearing(prev, curr)
//         let bearingOut = getGreatCircleBearing(curr, next)
//
//         let angleChange = getAngleDifference(bearingIn, bearingOut)
//         if (Math.abs(angleChange) >= turnThresholdDegrees) {
//             let turnType: 'Left' | 'Right' | 'U-Turn';
//             if (Math.abs(angleChange) >= uTurnThresholdDegrees) {
//                 turnType = 'U-Turn';
//             } else if (angleChange > 0) {
//                 turnType = 'Right';
//             } else {
//                 turnType = 'Left';
//             }
//
//             let turn = {
//                 index: i,
//                 type: turnType,
//                 coordinates: [prev, curr, next],
//                 distanceToPrev: getPreciseDistance(prev, curr),
//                 distanceToNext: getPreciseDistance(curr, next),
//                 bearingIn: bearingIn,
//                 bearingOut: bearingOut,
//                 angleChange: angleChange,
//                 duration: timestamps[i + 1] - timestamps[i - 1],
//                 flyDistance: getPreciseDistance(prev, next),
//                 distance: getPreciseDistance(prev, curr) + getPreciseDistance(curr, next),
//                 timestamp: timestamps[i]
//             }
//             turns.push(turn)
//         }
//     }
//     return turns
// }
//
// class Session {
//     sessionId: string
//     route: string
//     startTime = 0
//     endTime = 0
//     coordinates: number[][]
//     timestamps: number[]
//     deleteCalled: boolean = false
//     constructor(sessionId: string, route: string) {
//         this.route = route
//         this.sessionId = sessionId
//         this.coordinates = []
//         this.timestamps = []
//     }
//
//     addCoordinate(payload: any) {
//         if (this.coordinates.length == 0) {
//             this.startTime = payload.timestamp
//         }
//         this.coordinates.push([payload.longitude, payload.latitude])
//         this.timestamps.push(payload.timestamp)
//         this.endTime = payload.timestamp
//     }
//
//     private getDistanceAt(index: number) : number {
//         if (index == 0) {
//             return 0
//         }
//         let prev = this.coordinates[index - 1] as GeolibGeoJSONPoint
//         let curr = this.coordinates[index] as GeolibGeoJSONPoint
//         return getPreciseDistance(prev, curr)
//     }
//
//     private getTimeDifferenceAt(index: number) : number {
//         if (index == 0) {
//             return 0
//         }
//         let prev = this.timestamps[index - 1]
//         let curr = this.timestamps[index]
//         return curr - prev // milliseconds
//     }
//
//     getAverageTimeDifference() : number {
//         let timeDifference = 0
//         for (let i = 0; i < this.timestamps.length; i++) {
//             timeDifference += this.getTimeDifferenceAt(i)
//         }
//         return timeDifference/this.timestamps.length
//     }
//
//     getMovingCumulative(minMetersPerSecond: number) : number[] {
//         let distance = 0
//         let duration = 0
//         for (let i = 0; i < this.coordinates.length; i++) {
//             let average =
//                 this.getTimeDifferenceAt(i) > 0 ? this.getDistanceAt(i) / (this.getTimeDifferenceAt(i)/1000) : 0 // meters per second
//             if (average >= minMetersPerSecond) {
//                 distance += this.getDistanceAt(i)
//                 duration += this.getTimeDifferenceAt(i)
//             }
//         }
//         return [distance, duration, duration > 0 ? distance/duration : Infinity, minMetersPerSecond] // meters, duration(ms), average
//     }
//
//     getCumulative() : number[] {
//         return this.getMovingCumulative(0)
//     }
//
//     getSessionDuration() : number {
//         return this.endTime - this.startTime
//     }
//
//     getFlyDistance() : number {
//         return getPreciseDistance(this.coordinates[0] as GeolibGeoJSONPoint,
//             this.coordinates[this.coordinates.length - 1] as GeolibGeoJSONPoint)
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
//         return {
//             session: this.sessionId,
//             title: this.route,
//             numCoordinates: this.coordinates.length,
//             startTime: new Date(this.startTime).toTimeString(),
//             endTime: new Date(this.endTime).toTimeString(),
//             deleteCalled: this.deleteCalled,
//             duration: this.getSessionDuration(),
//             flyDistance: this.getFlyDistance(),
//             cumulative: this.getCumulative(),
//             moving: this.getMovingCumulative(minMetersPerSecond),
//             averageTimeDifference: this.getAverageTimeDifference(),
//             summary: this.getSummary(minMetersPerSecond),
//             timestamps: this.timestamps
//         }
//     }
//
//     toFeatureCollection(minMetersPerSecond: number = 4) {
//         return {
//             type: "FeatureCollection",
//             features: [
//                 {
//                     type: "Feature",
//                     properties: this.getProperties(minMetersPerSecond),
//                     geometry: {
//                         type: "LineString",
//                         coordinates: this.coordinates
//                     }
//                 }
//             ]
//         }
//     }
//     hasCoordinates() {
//         return this.coordinates.length > 0
//     }
// }
//
// class CumulativeSession {
//     sessions: Session[]
//     sessionId: string
//     route: string
//     startTime = 0
//     endTime = 0
//     coordinates: number[][]
//     timestamps: number[]
//     name: string
//     constructor(sessions: Session[]) {
//         this.sessions = sessions
//         this.sessionId = sessions[0].sessionId
//         this.route = sessions[0].route
//         this.name = `${this.route} - ${this.sessions.length} sessions`
//         this.startTime = sessions[0].startTime
//         this.endTime = sessions[sessions.length - 1].endTime
//         this.coordinates = sessions.refine((a, b) => [...a, ...b.coordinates], [] as number[][])
//         this.startTime = sessions[0].startTime
//         this.endTime = sessions[sessions.length - 1].endTime
//         this.coordinates = sessions.refine((a, b) => [...a, ...b.coordinates], [] as number[][])
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
//         let turns = findTurnsInCoordinates(this.timestamps, this.coordinates, 80, 150)
//         let pivots = findPivotsByStraightLines(this.coordinates, this.timestamps, 4, 30, 80, 150)
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
//             numPivots: pivots.length,
//             pivots: pivots,
//             numTurns: turns.length,
//             turns: turns,
//         }
//     }
//
//     pivotToFeature(pivot: any) {
//         return {
//             type: "Feature",
//             properties: {
//                 type: pivot.type,
//                 start: pivot.start,
//                 pivot: pivot.pivot,
//                 end: pivot.end,
//                 bearingIn: pivot.bearingIn,
//                 bearingOut: pivot.bearingOut,
//             },
//             geometry: {
//                 type: "Point",
//                 coordinates: this.coordinates[pivot.pivot]
//             }
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
//
// async function readJSONLines(file: string)  {
//     let operatorSessions: Map<string, Session[]> = new Map()
//     let trackerSessions: Map<string, Session[]> = new Map()
//     let operatorSession: Session | undefined
//     let trackerSession: Session | undefined
//     let route = ""
//
//     const handler : FileHandle = await open(file);
//     for await (const line of handler.readLines()) {
//         try {
//             let data = JSON.parse(line!)
//             if (data.type === "response" && data.url.includes("hello")) {
//                 let route = data.payload.route
//                 if (data.payload.type === "operator") {
//                     let sessions = operatorSessions.get(route)
//                     if (!sessions) {
//                         sessions = []
//                         operatorSessions.set(route, sessions)
//                     }
//                     operatorSession = new Session(data.sessionId, route)
//                     sessions.push(operatorSession)
//                 } else {
//                     let sessions = trackerSessions.get(route)
//                     if (!sessions) {
//                         sessions = []
//                         trackerSessions.set(route, sessions)
//                     }
//                     trackerSession = new Session(data.sessionId, route)
//                     sessions.push(trackerSession)
//                 }
//             }
//             if (operatorSession && data.type === "response" && data.statusCode == "200" && data.method === "POST" && data.url.includes(route)) {
//                 if (data.url.includes("location")) {
//                     operatorSession.addCoordinate(data.payload)
//                 }
//             }
//             if (operatorSession && data.type === "response" && data.statusCode == "200" && data.method === "DELETE" && data.url.includes(route)) {
//                 if (data.url.includes("location")) {
//                     operatorSession.deleteCalled = true
//                 }
//             }
//             if (trackerSession && data.type === "response" && data.statusCode == "200" && data.method === "GET" && data.url.includes(route)) {
//                 if (data.url.includes("location")) {
//                     trackerSession.addCoordinate(data.payload)
//                 }
//             }
//         } catch (error) {
//             console.log(`JSON Error in ${file}`)
//         }
//     }
//     return [operatorSessions, trackerSessions];
// }
//
// function writeSession(session: Session, dir: string, index: number, minMetersPerSecond: number = 4) {
//     fs.mkdirSync(`${dir}/${session.sessionId}`, {recursive: true})
//     fs.writeFileSync(`${dir}/${session.sessionId}/${session.route}-${index}.json`, JSON.stringify(session.toFeatureCollection(minMetersPerSecond), null, 2))
// }
// function writeCumulativeSession(session: CumulativeSession, dir: string, minMetersPerSecond: number = 4) {
//     fs.mkdirSync(`${dir}/${session.sessionId}`, {recursive: true})
//     fs.writeFileSync(`${dir}/${session.sessionId}/${session.name}-features.json`, JSON.stringify(session.toFeaturesCollection(minMetersPerSecond), null, 2))
// }
// function writeCumulativeSessionFeatures(session: CumulativeSession, dir: string, minMetersPerSecond: number = 4) {
//     fs.mkdirSync(`${dir}/${session.sessionId}`, {recursive: true})
//     fs.writeFileSync(`${dir}/${session.sessionId}/${session.name}-feature.json`, JSON.stringify(session.toFeatureCollection(minMetersPerSecond), null, 2))
// }
//
// function writeNonEmptySessions(dir: string, routeSessions: Map<string, Session[]>, minMetersPerSecond: number = 4) {
//     routeSessions.forEach((sessions) => {
//         let ss = sessions.filter((s: Session) => s.hasCoordinates())
//         ss.forEach((session, index) => {
//             writeSession(session, dir, index, minMetersPerSecond);
//         })
//         if (ss.length > 0) {
//             writeCumulativeSession(new CumulativeSession(ss), dir, minMetersPerSecond)
//             writeCumulativeSessionFeatures(new CumulativeSession(ss), dir, minMetersPerSecond)
//         }
//     })
// }
//
// /**
//  * Processes the logs in the specified directory to the specified destination. The destination
//  * will contain directories "operator" and "tracker". Each directory will contain a directory
//  * named by the session id. Each session directory will contain GeoJSON files for each route indexed
//  * by the order in which they were found.
//  * @param dir The directory to process the logs from.
//  * @param dest The directory to write the processed logs to. Defaults to dir + "sessions".
//  */
// export async function processLogsToSessions(dir: string, dest: string = dir + "sessions", minMetersPerSecond: number = 4) {
//     let files = fs.readdirSync(dir).sort()
//     for (const file of files) {
//         console.log(`Processing ${dir}/${file}`)
//         if (!fs.statSync(dir + "/" + file).isDirectory()) {
//             let[operatorSessions, trackerSessions] = await readJSONLines(dir + "/" + file)
//             if (operatorSessions.size == 0) {
//                 console.log(`No posted sessions for ${dir}/${file}`)
//             } else {
//                 writeNonEmptySessions(`${dest}/operator`, operatorSessions, minMetersPerSecond)
//             }
//             if (trackerSessions.size == 0) {
//                 console.log(`No get sessions for ${dir}/${file}`)
//             } else {
//                 writeNonEmptySessions(`${dest}/tracking`, trackerSessions, minMetersPerSecond)
//             }
//         }
//     }
// }
//
// processLogsToSessions("logs", "logsessions" ,1)
//     .then(() => { console.log("Done")})
//

import {SessionProcessor} from "./SessionProcessor.ts";

let processor = new SessionProcessor({
    minMetersPerSecond: 4,
    straightLineThreshold: 20,
    minLineLength: 4,
    distanceThreshold: 32
})

processor.processLogsToSessions("logs", "logsessions")
.then(() => { console.log("Done")})
