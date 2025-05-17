
import React from "react";
import {MapContainer, Polyline, TileLayer} from "react-leaflet";
import "./MapElement.css"
import L from "leaflet";
import {BusMarker} from "./BusMarker.tsx";
import {TrackerControl} from "./TrackerControl";
import * as G from "../../lib/GeoJSON";
import {PointMarker} from "./PointMarker";
import {BusDisplayMarker} from "./BusDisplayMarker.tsx";
import {getBusInfoLineString} from "../../lib/BusInfo.ts";

interface MapElementProps {
    geojson: any,
    enableTracker: boolean,
    editor: boolean
}

const DEFAULT_CLOSE_TOLERANCE_KM = 0.1

export class MapElement extends React.Component<MapElementProps, {}> {

    private myRef: React.RefObject<any>;

    constructor(props: MapElementProps) {
        super(props);

        this.myRef = React.createRef();

    }

    OpenStreetMap() {
        return (
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        )
    }

    BikeBusMap() {
        return (
            <TileLayer
                url={'https://api.mapbox.com/styles/v1/streicherd/clkyafeqb00ki01pifykf5jp8/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3RyZWljaGVyZCIsImEiOiJjbDkxZ2JuaDQxMXRpM25vNmRjdzNlZXVzIn0.BkniqpkfdbK_szBJGdr0KQ'}
                tileSize={512} zoomOffset={-1}
                attribution='Dr. Polar Humenn'/>

        )
    }

    getBounds() {
        return G.getBounds(this.props.geojson).map(x => [...x].reverse()) as L.LatLngTuple[]
    }

    getPositions(): L.LatLngTuple[] {
        let ls = this.props.geojson.features.find((f: any) => f.geometry.type === "LineString")
        if (ls) {
            return ls.geometry.coordinates.map((c: any) => c.slice(0, 2).reverse() as L.LatLngTuple)
        }
        return []
    }

    getDistanceFromLatLonInKm([lon1, lat1]: [number, number], [lon2, lat2]: [number, number]): number {
        function deg2rad(deg: number): number {
            return deg * (Math.PI / 180)
        }

        let R = 6371; // Radius of the earth in km
        let dLat = deg2rad(lat2 - lat1);  // deg2rad below
        let dLon = deg2rad(lon2 - lon1);
        let a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }

    getPointMarkers() {
        let fs = this.props.geojson.features as any[]
        let features = fs.filter((f: any) => f.geometry.type === "Point" && !f.properties.ignore)
        let ls = getBusInfoLineString(this.props.geojson)
        if (ls) {
            let start = ls.geometry.coordinates[0]
            let dest = ls.geometry.coordinates[ls.geometry.coordinates.length - 1]
            let hasStart = false
            let hasDest = false
            features.forEach((f: any, i: number) => {
                hasStart ||= i === 0 && this.getDistanceFromLatLonInKm(start, f.geometry.coordinates) < DEFAULT_CLOSE_TOLERANCE_KM
                hasDest ||= i === features.length - 1 && this.getDistanceFromLatLonInKm(dest, f.geometry.coordinates) < DEFAULT_CLOSE_TOLERANCE_KM
            })
            if (!hasDest) {
                let last = {type: "Feature", properties: {}, geometry: {type: "Point", coordinates: dest}}
                features.push(last)
            }
            if (!hasStart) {
                let first = {type: "Feature", properties: {}, geometry: {type: "Point", coordinates: start}}
                features = [first, ...features]
            }

            function getC(i: number) {
                return (i === 0) ? "marker-start" : (i === features.length - 1) ? "marker-destination" : "marker-waypoint"
            }

            return (
                <div className={"pointList"}>
                    {features.map((f: any, i: number) => <PointMarker className={getC(i)} key={i} feature={f}/>)}
                </div>
            )
        }

    }

    render() {
        let bounds = this.getBounds()

        let positions =  this.getPositions()

        // setTimeout(() => {
        //     self.myRef.current.fitBounds(bounds)
        // }, 100);
        return (
            <MapContainer ref={this.myRef}
                              attributionControl={true} style={{height: "100vh"}}
                          bounds={bounds}
                          scrollWheelZoom={true}
                          >
                <this.BikeBusMap/>
                <Polyline positions={positions}/>
                { this.getPointMarkers() }
                { this.props.editor && <BusDisplayMarker geojson={this.props.geojson}/> }
                { !this.props.editor && <BusMarker geojson={this.props.geojson} /> }
                { this.props.enableTracker ? <TrackerControl geojson={this.props.geojson}/> : null}
            </MapContainer>

        )
    }
}
