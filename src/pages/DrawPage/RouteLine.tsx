import React from "react";
import {getBusInfoLineString} from "../../lib/BusInfo.ts";
import {LatLngExpression} from "leaflet";
import {Polyline} from "react-leaflet";

interface RouteLineProps {
    geojson: any
}
export class RouteLine extends React.Component<RouteLineProps, {}> {

    render() {
        let ls = getBusInfoLineString(this.props.geojson);
        if (ls) {
            let positions = ls.geometry.coordinates.map(([lon, lat]:number[]) => [lat, lon] as LatLngExpression)
            return (
                <Polyline positions={positions}/>
            )
        }
    }
}
