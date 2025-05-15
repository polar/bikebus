import NanoCache from "nano-cache";

export class RoutesCache {
    cache = new NanoCache()
    routes: string[] = [];

    has(route: string) {
        return this.cache.get(route);
    }

    getRoutes() {
        return this.routes;
    }
    getLocation(route: string) {
        return this.cache.get(`locaton-${route}`)
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
