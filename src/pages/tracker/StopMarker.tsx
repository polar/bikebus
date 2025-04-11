import {Stop} from "../../lib/stop.ts";
import React from "react";
import ReactDOMServer from "react-dom/server";
import L, {divIcon} from "leaflet";
import {Marker} from "react-leaflet";

export class StopMarkerProps {
    stop!: Stop
}

export class StopMarker extends React.Component<StopMarkerProps> {

    stopMarker(stop: Stop){
        let icon = stop.icon || "https://cdn.glitch.global/6ba8c1b0-9df4-482f-9009-77d10d780dbb/bus_stop_circle.svg?v=1664245520908"

        return (
            <div className={`marker-container ${stop.markerClass}`}>
                <div className="marker-box">
                    <div><b>{stop.time}</b></div>
                </div>
                <div className="marker-box marker-box-center">
                    <img src={icon} alt="marker"/>

                </div>
                <div className="marker-box">
                    <div>
                        <b>{stop.name}</b>
                        <br/>
                        {stop.subtitle && <div>{stop.subtitle}</div>}
                    </div>
                </div>
            </div>
        );
    }

    render() {
        let s = this.stopMarker(this.props.stop)

        let element = ReactDOMServer.renderToString(s)
        let stopIcon = divIcon({className: '', html: element, iconAnchor: [150, 20], iconSize: [10, 10]})
        return (
            <Marker position={this.props.stop.coordinates as L.LatLngTuple} icon={stopIcon}/>
        )
    }
}
