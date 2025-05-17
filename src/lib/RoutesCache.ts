import NanoCache from "nano-cache";
import fs from "node:fs";
import {clearInterval} from "node:timers";

export class RoutesCache {
    cache = new NanoCache()
    routes: string[] = [];

    initialize() {
        let names = fs.readdirSync(`${import.meta.dirname}/../stuff/routes`)
            .map(file => file.replace(".json",""))
        names.forEach(name => {this.add(name)})
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
        let oldRoutes = [...this.routes];
        let newRoutes = fs.readdirSync(`${import.meta.dirname}/../stuff/routes`)
            .map(file => file.replace(".json",""))
       oldRoutes.map(route => {
           if (newRoutes.includes(route)) {
               // We have it. We leave it
           } else {
               // We no longer have it, so remove it
               this.remove(route)
           }
       })

       newRoutes.forEach(route => {
           if (oldRoutes.includes(route)) {
               // We still have it, leave it alone
           } else {
               // We do not have it. It is new. Add it.
               this.add(route)
           }
       });
    }

    has(route: string) {
        return this.cache.get(route);
    }

    getRoutes() {
        return this.routes;
    }
    getLocation(route: string) {
        return this.cache.get(`location-${route}`)
    }

    add(route: string) {
        this.cache.set(route, true)
        this.routes.push(route);
    }

    setLocation(route: string, location: any) {
        this.cache.set(`location-${route}`,location)
    }

    removeLocation(route: string) {
        this.cache.set(`location-${route}`, null)
    }

    remove(route: string) {
        this.cache.set(`location-${route}`, null);
        this.cache.set(route, null);
        this.routes = this.routes.filter(r => r !== route);
    }
}
