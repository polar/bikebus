import NanoCache from "nano-cache";
import fs from "node:fs";
import {clearInterval} from "node:timers";
import {getBusInfoLineString} from "./BusInfo.ts";

export const DEFAULT_ROUTES_LIMIT = 20

export class MakeStore {
    cache = new NanoCache()
    makes: string[] = [];
    limit = DEFAULT_ROUTES_LIMIT
    dir: string

    constructor(dir: string, limit?: number) {
        this.dir = dir
        if (limit !== undefined && limit > 0) {
            this.limit = limit
        }
    }

    atLimit() {
        return this.limit <= this.makes.length
    }

    initialize() {
        fs.mkdirSync(`${import.meta.dirname}/../stuff/${this.dir}`, {recursive: true})

        let names = fs.readdirSync(`${import.meta.dirname}/../stuff/${this.dir}`)
            .map(file => file.replace(".json",""))
        names.forEach(name => {
            try {
                let fc = fs.readFileSync(`${import.meta.dirname}/../stuff/${this.dir}/${name}.json`)
                if (fc) {
                    let json = JSON.parse(fc.toString());
                    this.addMake(name, json)
                }
            } catch (e) {
                console.error(e)
            }
        })
    }

    intervalID?: NodeJS.Timeout

    startUpdate() {
        this.intervalID = setInterval(() => {
            this.reset()
        }, 1000)
    }

    stopUpdate() {
        clearInterval(this.intervalID)
    }

    // @ts-ignore
    reset() {
        let oldMakes = [...this.makes];
        let newMakes = fs.readdirSync(`${import.meta.dirname}/../stuff/${this.dir}`)
            .map(file => file.replace(".json",""))
       oldMakes.map(draw => {
           if (newMakes.includes(draw)) {
               // We have it. We leave it
           } else {
               // We no longer have it, so remove it
               this.removeMake(draw)
           }
       })

       newMakes.forEach(draw => {
           if (oldMakes.includes(draw)) {
               // We still have it, leave it alone
           } else {
               // We do not have it. It is new. Add it.
               let data = fs.readFileSync(`${import.meta.dirname}/../stuff/${this.dir}/${draw}.json`)
               let json = JSON.parse(data.toString())
               this.addMake(draw, json)
           }
       });
    }

    has(route?: string) {
        return !!this.cache.get(route);
    }

    getMakes() {
        return this.makes;
    }

    getMake(name: string) {
        return this.cache.get(name) as any;
    }

    getLocation(name: string) {
        return this.cache.get(`location-${name}`)
    }

    addMake(name: string, geojson?: any) {
        if (geojson) {
            this.cache.set(name, geojson)
        } else {
            this.cache.set(name, {
                type: "FeatureCollection",
                features: [
                    {
                        type: "Feature",
                        properties: {
                            name: name,
                            timestamps: []
                        },
                        geometry: {
                            type: "LineString",
                            coordinates: []
                        }
                    }
                ]
            })
        }
        this.writeMake(name, this.cache.get(name))
        this.makes.push(name);
    }

    private writeMake(name: string, draw: any) {
        try {
            fs.writeFileSync(`${import.meta.dirname}/../stuff/${this.dir}/${name}.json`, JSON.stringify(draw))
        } catch (e) {
            console.error(e)
        }
    }

    addLocation(name: string, location: any) {
        this.cache.set(`location-${name}`,location)
        let fc = this.cache.get(`${name}`)
        let ls = getBusInfoLineString(fc)
        let coordinates = [location.longitude, location.latitude]
        if (ls) {
            ls.properties.timestamps.push(location.timestamp)
            ls.geometry.coordinates.push(coordinates)
            this.cache.set(name, fc)
            this.writeMake(name, fc)
        }
    }

    addFeature(name: string, feature: any) {
        let fc : any = this.cache.get(`${name}`)
        let ls = getBusInfoLineString(fc)
        if (ls) {
            fc.features.push(feature)
            this.cache.set(name, fc)
            this.writeMake(name, fc)
        }
    }

    removeLocation(name: string) {
        this.cache.set(`location-${name}`, null)
    }

    removeMake(name: string) {
        this.cache.set(`location-${name}`, null);
        this.cache.set(name, null);
        this.makes = this.makes.filter(r => r !== name);
        try {
            fs.rmSync(`${import.meta.dirname}/../stuff/${this.dir}/${name}.json`)
        } catch (e) {
            console.error(e)
        }
    }
}
