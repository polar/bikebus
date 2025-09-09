
export function getBusInfoTitle(geojson: any ): string | undefined {
    let ls = getBusInfoLineString(geojson);
    if (ls) {
        return (ls.properties.title || "").replaceAll(" ", "_")
    }
}
export function ensureBusInfoTitle(geojson: any): any {
    let ls = getBusInfoLineString(geojson)
    if (ls) {
        ls.properties.title ||= ""
    }
    return geojson
}
export function setBusInfoBusIcon(geojson: any, icon: string): any {
    let ls =  getBusInfoLineString(geojson);
    if (ls) {
        ls.properties.busIcon = icon
    }
    return geojson
}

export function getBusInfoBusIccon(geojson: any, icon: string) : string {
    let ls = getBusInfoLineString(geojson);
    if (ls) {
        return ls.properties.busIcon;
    }
    return icon
}

export function getBusInfoLineString(geojson: any): any {
    return geojson?.features?.find((f:any) => f.type === "Feature" && f.geometry.type === "LineString")
}

export function getBusInfoLineStringLastTimestamp(geojson: any): number | undefined {
    let ls = getBusInfoLineString(geojson);
    if (ls && ls.properties.timestamps && ls.properties.timestamps.length > 0) {
        return ls.properties.timestamps[ls.properties.timestamps.length - 1]
    }
}
