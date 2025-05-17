
export function getBusInfoTitle(geojson: any ): string | undefined {
    if (geojson) {
        let ls = getBusInfoLineString(geojson);
        if (ls) {
            return (ls.properties.title || "").replaceAll(" ", "_")
        }
    }
}
export function ensureBusInfoTitle(geojson: any): any {
    if (geojson) {
        let ls = getBusInfoLineString(geojson)
        if (ls) {
            ls.properties.title ||= ""
        }
        return geojson
    }
}
export function setBusInfoBusIcon(geojson: any, icon: string): any {
    if (geojson) {
        let ls =  getBusInfoLineString(geojson);
        if (ls) {
            ls.properties.busIcon = icon
        }
        return geojson
    }
}
export function getBusInfoLineString(geojson: any): any {
    return geojson.features.find((f:any) => f.type === "Feature" && f.geometry.type === "LineString")
}
