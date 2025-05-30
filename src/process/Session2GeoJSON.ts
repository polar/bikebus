
import fs from "node:fs"

import {FileHandle, open} from "node:fs/promises"

class Session {
    sessionId: string
    route: string
    startTime = 0
    endTime = 0
    coordinates: number[][]
    timestamps: number[]
    constructor(sessionId: string, route: string) {
        this.route = route
        this.sessionId = sessionId
        this.coordinates = []
        this.timestamps = []
    }
    addCoordinate(payload: any) {
        if (this.coordinates.length == 0) {
            this.startTime = payload.timestamp
        }
        this.coordinates.push([payload.longitude, payload.latitude])
        this.timestamps.push(payload.timestamp)
        this.endTime = payload.timestamp
    }

    toFeatureCollection() {
        return {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    properties: {
                        session: this.sessionId,
                        title: this.route,
                        startTime: new Date(this.startTime).toTimeString(),
                        endTime: new Date(this.endTime).toTimeString(),
                        timestamps: this.timestamps
                    },
                    geometry: {
                        type: "LineString",
                        coordinates: this.coordinates
                    }
                }
            ]
        }
    }
    hasCoordinates() {
        return this.coordinates.length > 0
    }
}

async function readJSONLines(file: string)  {
    let operatorSessions: Map<string, Session[]> = new Map()
    let trackerSessions: Map<string, Session[]> = new Map()
    let operatorSession: Session | undefined
    let trackerSession: Session | undefined
    let route = ""

    const handler : FileHandle = await open(file);
    for await (const line of handler.readLines()) {
        try {
            let data = JSON.parse(line!)
            if (data.type === "response" && data.url.includes("hello")) {
                let route = data.payload.route
                if (data.payload.type === "operator") {
                    let sessions = operatorSessions.get(route)
                    if (!sessions) {
                        sessions = []
                        operatorSessions.set(route, sessions)
                    }
                    operatorSession = new Session(data.sessionId, route)
                    sessions.push(operatorSession)
                } else {
                    let sessions = trackerSessions.get(route)
                    if (!sessions) {
                        sessions = []
                        trackerSessions.set(route, sessions)
                    }
                    trackerSession = new Session(data.sessionId, route)
                    sessions.push(trackerSession)
                }
            }
            if (operatorSession && data.type === "response" && data.statusCode == "200" && data.method === "POST" && data.url.includes(route)) {
                if (data.url.includes("location")) {
                    operatorSession.addCoordinate(data.payload)
                }
            }
            if (trackerSession && data.type === "response" && data.statusCode == "200" && data.method === "GET" && data.url.includes(route)) {
                if (data.url.includes("location")) {
                    trackerSession.addCoordinate(data.payload)
                }
            }
        } catch (error) {
            console.log(`JSON Error in ${file}`)
        }
    }
    return [operatorSessions, trackerSessions];
}

function writeNonEmptySessions(dir: string, routeSessions: Map<string, Session[]>) {
    routeSessions.forEach((sessions) => {
        sessions.forEach((session, index) => {
            if (session.hasCoordinates()) {
                fs.mkdirSync(`${dir}/${session.sessionId}`, {recursive: true})
                fs.writeFileSync(`${dir}/${session.sessionId}/${session.route}-${index}.json`, JSON.stringify(session.toFeatureCollection(), null, 2))
            }
        })
    })
}

/**
 * Processes the logs in the specified directory to the specified destination. The destination
 * will contain directories "operator" and "tracker". Each directory will contain a directory
 * named by the session id. Each session directory will contain GeoJSON files for each route indexed
 * by the order in which they were found.
 * @param dir The directory to process the logs from.
 * @param dest The directory to write the processed logs to. Defaults to dir + "sessions".
 */
export async function processLogsToSessions(dir: string, dest: string = dir + "sessions") {
    let files = fs.readdirSync(dir)
    for (const file of files) {
        if (!fs.statSync(dir + "/" + file).isDirectory()) {
            let[operatorSessions, trackerSessions] = await readJSONLines(dir + "/" + file)
            if (operatorSessions.size == 0) {
                console.log(`No posted sessions for ${dir}/${file}`)
            } else {
                writeNonEmptySessions(`${dest}/operator`, operatorSessions)
            }
            if (trackerSessions.size == 0) {
                console.log(`No get sessions for ${dir}/${file}`)
            } else {
                writeNonEmptySessions(`${dest}/tracking`, trackerSessions)
            }
        }
    }
}

processLogsToSessions("logs")
    .then(() => { console.log("Done")})

