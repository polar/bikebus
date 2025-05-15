
import React from "react";
import ReactDOMServer from "react-dom/server";
import L, {divIcon} from "leaflet";
import {Marker} from "react-leaflet";

export interface PointMarkerProps {
    feature: any
}

export class PointMarker extends React.Component<PointMarkerProps> {

    pointMarker(feature: any){
        let icon = feature.properties.icon || "https://cdn.glitch.global/6ba8c1b0-9df4-482f-9009-77d10d780dbb/bus_stop_circle.svg?v=1664245520908"

        let markerClass = ""
        if (feature.properties.left) {
            markerClass += " label-left push-up-4x"
        }
        if (feature.properties.rotate65) {
            markerClass += " rotate-65"
        }
        if (feature.properties.rotate35) {
            markerClass += " rotate-35"
        }
        if (markerClass === "") {
            markerClass = " label-right"
        }
        return (
            <div className={`marker-container ${markerClass}`}>
                <div className="marker-box">
                    <div><b>{feature.time}</b></div>
                </div>
                <div className="marker-box marker-box-center">
                    <img src={icon} alt="marker"/>

                </div>
                <div className="marker-box">
                    <div>
                        <b>{feature.properties.name || feature.properties?.label?.split(",")[0]}</b>
                        <br/>
                        {feature.properties.subtitle && <div>{feature.properties.subtitle}</div>}
                    </div>
                </div>
            </div>
        );
    }

    render() {
        let s = this.pointMarker(this.props.feature)

        let element = ReactDOMServer.renderToString(s)
        let latLong : L.LatLngTuple = this.props.feature.geometry.coordinates.slice(0,2).reverse()
        let icon = divIcon({className: '', html: element, iconAnchor: [150, 20], iconSize: [10, 10]})
        return (
            <Marker position={latLong} icon={icon}/>
        )
    }
}
