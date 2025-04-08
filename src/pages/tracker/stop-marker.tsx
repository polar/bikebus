import {Stop} from "../../stop.ts";
import {MapDiv} from "./MapDiv.tsx";
import React from "react";
import * as L from "leaflet";
import {LatLngExpression} from "leaflet";

export interface StopMarkerProps {
    map: MapDiv,
    stop: Stop,
    index: number
}

export class StopMarker extends React.Component<StopMarkerProps> {

    constructor(props: { map: MapDiv, stop: Stop, index: number }) {
        super(props)
    }

    render(){
        let icon = this.props.stop.icon || "https://cdn.glitch.global/6ba8c1b0-9df4-482f-9009-77d10d780dbb/bus_stop_circle.svg?v=1664245520908"

        return (
            <div id={`stop-marker-${this.props.index}`} className={`marker-container ${this.props.stop.markerClass}`}>
                <div className="marker-box">
                    <div><b>{this.props.stop.time}</b></div>
                </div>
                <div className="marker-box marker-box-center">
                    <img src={icon} alt="marker"/>

                </div>
                <div className="marker-box">
                    <div>
                        <b>{this.props.stop.name}</b>
                        <br/>
                        {this.props.stop.subtitle && <div>{this.props.stop.subtitle}</div>}
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {
        if (this.props.map.map !== undefined) {
            const element = document.getElementById("stop-marker-" + this.props.index)
            if (element) {
                const icon = L.divIcon({className:'', html: element, iconAnchor: [150,20]})
                L.marker(this.props.stop.coordinates as LatLngExpression, {icon: icon}).addTo(this.props.map.map)
            }
        }
    }
}
