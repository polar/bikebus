
import {Stop} from "./stop.ts";
import {BusInfo} from "./BusInfo.ts";

// @ts-ignore
let url = "https://maps.openrouteservice.org/"
// @ts-ignore
let url2 = "https://maps.openrouteservice.org/#/directions/Meadow%20Brook,Syracuse,NY,USA/Meadowbrook%20Court,Syracuse,NY,USA/Bradford%20Parkway,Syracuse,NY,USA/Meadow%20Brook,Syracuse,NY,USA/600%20Crawford%20Avenue,Syracuse,NY,USA/1202%20Broad%20Street,Syracuse,NY,USA/Meadowbrook%20Drive,Syracuse,NY,USA/Meadowbrook%20Drive,Syracuse,NY,USA/Meadowbrook%20Drive,Syracuse,NY,USA/Meadowbrook%20Drive,Syracuse,NY,USA/Lancaster%20Avenue,Syracuse,NY,USA/data/55,130,32,198,15,97,4,224,38,9,96,59,2,24,5,192,166,6,113,0,184,64,90,1,216,3,96,14,128,6,1,57,136,21,150,194,2,96,25,128,22,1,25,40,224,26,22,152,165,134,52,90,55,44,80,167,114,162,3,113,19,38,210,73,38,76,0,115,145,160,208,141,54,60,251,151,104,89,114,154,132,58,104,18,198,73,82,243,136,54,34,198,167,6,109,10,137,223,212,91,101,131,238,57,97,118,90,220,153,92,77,153,153,202,152,61,220,133,93,152,56,152,146,150,50,146,206,74,129,144,80,133,146,154,146,134,154,41,152,202,144,169,131,50,144,149,149,58,205,141,152,140,51,145,210,131,95,55,130,137,156,130,169,82,133,153,70,166,146,176,47,175,35,93,165,208,197,183,93,168,76,59,56,144,163,42,166,181,89,137,143,63,185,85,154,46,206,144,195,161,193,156,166,145,97,141,65,62,184,153,95,216,139,103,184,68,253,80,130,179,88,246,184,143,85,218,144,69,134,245,92,141,159,200,200,102,235,28,50,52,53,29,27,163,69,233,109,114,2,66,155,24,192,199,240,128,184,32,8,0,1,213,15,0,130,33,176,56,80,0,11,202,0,5,181,192,185,81,232,232,4,0,6,111,0,0,219,161,112,224,0,39,152,14,148,128,3,155,225,160,232,14,64,21,206,156,134,128,162,64,148,244,53,61,3,204,65,129,25,120,30,100,24,156,79,66,33,96,232,88,8,0,11,225,170,0"

export class GeoJSON2BusInfo {
    static getStopStructures(g: any) {
        if (g.type === "FeatureCollection") {
            let features = g.features;
            let routeFeature = features.find((g:any) => g.type === "Feature" && g.geometry.type === "LineString");
            if (routeFeature) {
                let coordinates = routeFeature.geometry.coordinates;
                if (coordinates.length > 0) {
                    return coordinates.map((c: number[]) => {
                        return {waypointOnly: true, coordinates: c.slice(0, 2).reverse()}
                    })
                }
            }
        }
    }

    static getStops(g: any) {
        if (g.type === "FeatureCollection") {
            let features = g.features;
            return features.filter((g:any) => g.type === "Feature" && g.geometry.type === "Point");
        }
    }

    static getBusInfoStops(g: any) : Stop[] | undefined {
        if (g.type === "FeatureCollection") {
            let features = g.features;
            if (features) {
                let routeFeature = features.find((g:any) => g.type === "Feature" && g.geometry.type === "LineString");
                if (routeFeature && routeFeature.properties.way_points) {
                    let stops = this.getStopStructures(g);
                    let stopFeatures = this.getStops(g);
                    if (stops) {
                        let way_points: number[] = routeFeature.properties.way_points;
                        way_points.forEach((s,i) => {
                            stops[s].name = stopFeatures[i].properties.label.split(",")[0];
                            stops[s].waypointOnly = undefined;
                            stops[s].markerClass = "stop";
                        })
                        return stops
                        }
                    }
                }
            }
        }
        static getBusInfo(g: any) : BusInfo | undefined {
            let stops = this.getBusInfoStops(g);
            if (stops) {
                let bottomLeft = stops.reduce((accumulated, current) =>
                    [Math.min(accumulated[0], current.coordinates[0]), Math.min(accumulated[1], current.coordinates[1])], [Infinity, Infinity])
                let topRight = stops.reduce((accumulated, current) =>
                    [Math.max(accumulated[0], current.coordinates[0]), Math.max(accumulated[1], current.coordinates[1])], [-Infinity, -Infinity])

                return {
                    ctu: false,
                    headerImageAlt: "",
                    headerImageSrc: "",
                    minZoomLevel: 0,
                    route: "",
                    runInfo: "",
                    title: "Bike Party Route",
                    name: "Bike Party",
                    trackerBounds: {
                        bottomLeft: bottomLeft,
                        topRight: topRight
                    },
                    trackerTileSrcPattern: "https://cdn.glitch.globa…10.05.22.{z}.{x}.{y}.png",
                    mapHeight: "463px",
                    color: "#EFB143",
                    busIcon: "/api/icons8-party-96.png",
                    globalMarkerClass: "label-right",
                    stops: stops
                }
            }
        }

        static getBusInfo2 (g: any) {
            let stops =  this.getBusInfoStops(g);
            if (stops) {
                let bottomLeft = stops.reduce((accumulated, current) =>
                    [Math.min(accumulated[0], current.coordinates[0]), Math.min(accumulated[1], current.coordinates[1])], [Infinity, Infinity])
                let topRight = stops.reduce((accumulated, current) =>
                    [Math.max(accumulated[0], current.coordinates[0]), Math.max(accumulated[1], current.coordinates[1])], [-Infinity, -Infinity])

                return ({
                    title: "Bike Party Route",
                    trackerBounds: {bottomLeft: bottomLeft, topRight: topRight},
                    name: "Bike Party",
                    busIcon: "/api/icons8-party-96.png",
                    globalMarkerClass: "label-right",
                    geojson: g
                })
            }
        }
}
