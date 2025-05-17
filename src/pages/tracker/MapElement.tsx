
import React from "react";
import {MapContainer, Polyline, TileLayer} from "react-leaflet";
import "./MapElement.css"
import L from "leaflet";
import {BusMarker} from "./BusMarker.tsx";
import {TrackerControl} from "./TrackerControl";
import * as G from "../../lib/GeoJSON";
import {PointMarker} from "./PointMarker";
import {BusDisplayMarker} from "./BusDisplayMarker.tsx";

interface MapElementProps {
    geojson: any,
    enableTracker: boolean,
    editor: boolean
}

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
            <TileLayer url={'https://api.mapbox.com/styles/v1/streicherd/clkyafeqb00ki01pifykf5jp8/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3RyZWljaGVyZCIsImEiOiJjbDkxZ2JuaDQxMXRpM25vNmRjdzNlZXVzIn0.BkniqpkfdbK_szBJGdr0KQ'}
                       tileSize={512} zoomOffset={-1}
                       attribution='Dr. Polar Humenn' />

        )
    }

    getBounds() {
        return G.getBounds(this.props.geojson).map(x => [...x].reverse()) as L.LatLngTuple[]
    }

    getPositions(): L.LatLngTuple[] {
        let ls = this.props.geojson.features.find((f:any) => f.geometry.type === "LineString")
        if (ls) {
            return ls.geometry.coordinates.map((c:any) => c.slice(0,2).reverse() as L.LatLngTuple)
        }
        return []
    }

    getPointMarkers() {
        let fs = this.props.geojson.features as any[]
        let features = fs.filter((f:any) => f.geometry.type === "Point" && !f.properties.ignore)
        return features.map((f:any, index: number) => <PointMarker key={index} feature={f}/>)
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
