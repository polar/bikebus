
import {BaseSession} from "./BaseSession.ts";

export class SingleSessionBuilder {
    private session: BaseSession | null = null

    constructor(sessionId: string, route: string) {
        this.session = new BaseSession(sessionId, route)
    }

    addCoordinate(payload: any) {
        this.session!.coordinates.push([payload.longitude, payload.latitude])
        this.session!.timestamps.push(payload.timestamp)
        return this
    }

    addSession(session: BaseSession) {
        if (this.session!.coordinates.length != this.session!.timestamps.length) {
            throw new Error("Malformed Session: Cannot add session with different lengths for coordinates and timestamps")
        }

        this.session!.coordinates = [...this.session!.coordinates, ...session.coordinates]
        this.session!.timestamps = [...this.session!.timestamps, ...session.timestamps]
        this.session!.deleteCalled ||= session.deleteCalled
        return this
    }

    deleteCalled() {
        this.session!.deleteCalled = true
        return this
    }

    build() {
        let result = this.session
        this.session = null;
        return result
    }
}
