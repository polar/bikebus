
import {BusInfo} from "../../lib/BusInfo.ts";
import React from "react";
import {MapContainer, Polyline, TileLayer} from "react-leaflet";
import "./MapElement.css"
import {StopMarker} from "./StopMarker.tsx";
import L from "leaflet";
import {BusMarker} from "./BusMarker.tsx";
import {TrackerControl} from "./TrackerControl.tsx";

interface MapElementProps {
    busInfo: BusInfo,
    enableTracker: boolean,
}

interface MapElementState {
    bounds: L.LatLngTuple[]
}

export class MapElement extends React.Component<MapElementProps, MapElementState> {

    state: MapElementState = {
        bounds: []
    }

    constructor(props: MapElementProps) {
        super(props);
        let routeBounds = props.busInfo.trackerBounds;
        // First we set our stops to empty, as we must wait until the <div id="map"> is rendered.
        // Once it is mounted then we change the state, so that we can add the markers to the rendered map element.
        this.state = {
            bounds: [routeBounds.bottomLeft, routeBounds.topRight] as L.LatLngTuple[]
        }
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

    render() {
        let stops = this.props.busInfo.stops.filter(stop => !stop.waypointOnly)
        let route = this.props.busInfo.stops.map(stop => stop.coordinates as L.LatLngTuple)
        return (
            <MapContainer attributionControl={true} style={{height: "100vh"}} bounds={this.state.bounds} zoom={13} scrollWheelZoom={true}>
                <this.BikeBusMap/>
                {
                    stops.map(stop => <StopMarker stop={stop}/>)
                }

                <BusMarker {...this.props} />
                <Polyline positions={route}/>
                { this.props.enableTracker ? <TrackerControl {...this.props}/> : null}
            </MapContainer>
        )
    }
}
