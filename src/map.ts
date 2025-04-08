import * as L  from "leaflet";
import {Stop} from "./stop"


export class Map {
    map: L.Map
    stops: Stop[] = []

    constructor(name = "map", zoom = 13, routeBounds: L.LatLngBounds) {
        this.map = L.map(name, {minZoom: zoom}).fitBounds(routeBounds);

        L.tileLayer(
            'https://api.mapbox.com/styles/v1/streicherd/clkyafeqb00ki01pifykf5jp8/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3RyZWljaGVyZCIsImEiOiJjbDkxZ2JuaDQxMXRpM25vNmRjdzNlZXVzIn0.BkniqpkfdbK_szBJGdr0KQ', {
                tileSize: 512,
                zoomOffset: -1,
                attribution: '© <a href="https://www.mapbox.com/contribute/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(this.map);

    }

    addStops(stops: Stop[], lineColor: string) {
        this.stops = stops
        this.stops = stops

        stops.forEach((stop, index) => {
            if (!stop.waypointOnly) {
                const element = document.getElementById("stop-marker-" + index)
                const icon = L.divIcon({className: '', html: element!.innerHTML, iconAnchor:[150,20]})
                L.marker([stop.coordinates[0], stop.coordinates[1]], {icon: icon}).addTo(this.map)
            }
        })

        const points = stops.map(stop => stop.coordinates as L.LatLngExpression)
        L.polyline(points, {color: lineColor, weight: 10}).addTo(this.map)
    }

    busPositionMarker?: any

    placeBusPositionMarker(latitude: number, longitude: number) {
        if (this.busPositionMarker) {
            this.map.removeLayer(this.busPositionMarker)
        }
        this.busPositionMarker = L.marker([latitude, longitude]).addTo(this.map)
    }
}
