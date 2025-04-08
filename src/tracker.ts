
import {Map} from "./map"

export class Tracker {
    map: Map
    route: string

    constructor(map: Map, route: string) {
        this.map = map
        this.route = route
    }

    async getBusPosition() {
        try {

            let resp = await fetch(`/bus/${this.route}/position`)
            if (resp.ok) {
                let json = await resp.json()
                this.map.busPositionMarker(json.latitude, json.longitude)
            }
        } catch (error) {
            console.error('Error', error)
        }
    }

    async trackBus() {
        await this.getBusPosition()
        setTimeout(() => {
            this.trackBus()
        }, 1000)
    }
}
