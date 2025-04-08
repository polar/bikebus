import {BusInfo} from "../../BusInfo.ts";
import React from "react";
import L from "leaflet";
import {Stop} from "../../stop.ts";
import {MarkerList} from "./MarkerList.tsx";

export interface MapDivProps {
    busInfo: BusInfo
}

export interface MapDivState {
    bounds: L.LatLngTuple[],
    stops: Stop[]
}

export class MapDiv extends React.Component<MapDivProps,MapDivState> {

    state : MapDivState
    // This is the leaflet map that gets instantiated after this component is rendered. See componentDidMount().
    map?: L.Map

    constructor(props: {busInfo: BusInfo}) {
        super(props)
        let routeBounds = props.busInfo.trackerBounds;
        // First we set our stops to empty, as we must wait until the <div id="map"> is rendered.
        // Once it is mounted then we change the state, so that we can add the markers to the rendered map element.
        this.state = {
            bounds: [routeBounds.bottomLeft, routeBounds.topRight] as L.LatLngTuple[],
            stops: []
        }
    }

    render() {
        // Only give the MarkerList the stops that are not waypoints.
        let stops = this.state.stops.filter(stop => !stop.waypointOnly);
        return (
            <>
                <div id="map"></div>
                <MarkerList stops={stops} map={this}/>
            </>
        )
    }

    componentDidMount() {
        this.map = L.map("map", {minZoom: this.props.busInfo.minZoomLevel}).fitBounds(this.state.bounds);

        L.tileLayer(
            'https://api.mapbox.com/styles/v1/streicherd/clkyafeqb00ki01pifykf5jp8/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3RyZWljaGVyZCIsImEiOiJjbDkxZ2JuaDQxMXRpM25vNmRjdzNlZXVzIn0.BkniqpkfdbK_szBJGdr0KQ', {
                tileSize: 512,
                zoomOffset: -1,
                attribution: '© <a href="https://www.mapbox.com/contribute/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(this.map);

        // Now add the stops to the state, causing a re-render of the MarkerList.
        this.setState({stops: this.props.busInfo.stops})

        // Draw the route of the MarkerList.
        const points = this.props.busInfo.stops.map(stop => stop.coordinates as L.LatLngExpression)
        L.polyline(points, {color: "brown", weight: 10}).addTo(this.map)
    }
}
