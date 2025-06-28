import {FileHandle, open} from "node:fs/promises";
import {BaseSession} from "./BaseSession.ts";
import fs from "node:fs";
import {SessionGeoJSONBuilder} from "./SessionGeoJSONBuilder.ts";

interface SessionProcessorOptions {
    minMetersPerSecond: number
    straightLineThreshold: number
    minLineLength: number
    distanceThreshold: number
}
export class SessionProcessor {

    opts: SessionProcessorOptions
    constructor(opts: SessionProcessorOptions) {
        this.opts = opts
    }


    static async readJSONLines(file: string)  {
        let operatorSessions: Map<string, BaseSession[]> = new Map()
        let trackerSessions: Map<string, BaseSession[]> = new Map()
        let operatorSession: BaseSession | undefined
        let trackerSession: BaseSession | undefined
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
                        operatorSession = new BaseSession(data.sessionId, route)
                        sessions.push(operatorSession)
                    } else {
                        let sessions = trackerSessions.get(route)
                        if (!sessions) {
                            sessions = []
                            trackerSessions.set(route, sessions)
                        }
                        trackerSession = new BaseSession(data.sessionId, route)
                        sessions.push(trackerSession)
                    }
                }
                if (operatorSession && data.type === "response" && data.statusCode == "200" && data.method === "POST" && data.url.includes(route)) {
                    if (data.url.includes("location")) {
                        operatorSession.addCoordinate(data.payload)
                    }
                }
                if (operatorSession && data.type === "response" && data.statusCode == "200" && data.method === "DELETE" && data.url.includes(route)) {
                    if (data.url.includes("location")) {
                        operatorSession.deleteCalled = true
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

    writeSession(session: BaseSession, dir: string, index: number) {
        let builder = new SessionGeoJSONBuilder({session: session,...this.opts})
        let json = JSON.stringify(builder.toGeoJSON(), null, 2)
        fs.mkdirSync(`${dir}/${session.sessionId}`, {recursive: true})
        fs.writeFileSync(`${dir}/${session.sessionId}/${session.route}-${index}.json`, json)
    }

    writeCumulativeSession(session: BaseSession, dir: string) {
        let builder = new SessionGeoJSONBuilder({session: session,...this.opts})
        let json = JSON.stringify(builder.toGeoJSON(), null, 2)
        fs.mkdirSync(`${dir}/${session.sessionId}`, {recursive: true})
        fs.writeFileSync(`${dir}/${session.sessionId}/${session.route}-features.json`, json)
    }

    writeReducedCumulativeSession(session: BaseSession, dir: string) {
        let builder = new SessionGeoJSONBuilder({session: session,...this.opts})
        let json = JSON.stringify(builder.reduce().toGeoJSON(), null, 2)
        fs.mkdirSync(`${dir}/${session.sessionId}`, {recursive: true})
        fs.writeFileSync(`${dir}/${session.sessionId}/${session.route}-reduced.json`, json)
    }

    writeNonEmptySessions(dir: string, routeSessions: Map<string, BaseSession[]>) {
        routeSessions.forEach((sessions) => {
            let ss = sessions.filter((s: BaseSession) => s.hasCoordinates())
            ss.forEach((session, index) => {
                this.writeSession(session, dir, index);
            })
            if (ss.length > 0) {
                let session = BaseSession.combine(ss)
                this.writeCumulativeSession(session, dir)
                this.writeReducedCumulativeSession(session, dir)
            }
        })
    }

    async processLogsToSessions(dir: string, dest: string = dir + "sessions") {
        let files = fs.readdirSync(dir).sort()
        for (const file of files) {
            console.log(`Processing ${dir}/${file}`)
            if (!fs.statSync(dir + "/" + file).isDirectory()) {
                let[operatorSessions, trackerSessions] = await SessionProcessor.readJSONLines(dir + "/" + file)
                if (operatorSessions.size == 0) {
                    console.log(`No posted sessions for ${dir}/${file}`)
                } else {
                    this.writeNonEmptySessions(`${dest}/operator`, operatorSessions)
                }
                if (trackerSessions.size == 0) {
                    console.log(`No get sessions for ${dir}/${file}`)
                } else {
                    this.writeNonEmptySessions(`${dest}/tracking`, trackerSessions)
                }
            }
        }
    }

}
