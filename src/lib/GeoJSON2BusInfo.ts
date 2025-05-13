import {BusInfo} from "./BusInfo"

let url = "https://maps.openrouteservice.org/"

export class GeoJSON2BusInfo {
    getLineString(g: any) {
        if (g.type === "FeatureCollection") {
            let features = g.features;
            let routeFeature = features.find(g => g.type === "Feature" && g.geometry === "LineString");
            if (routeFeature) {
                let coordinates = routeFeature.geometry.coordinates;
                if (coordinates.length > 0) {

                }
            }

        }
    }
}
export function(geojson) {
    let bi = {}
    bi.name = geojson.name
}
