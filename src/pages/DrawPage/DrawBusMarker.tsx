import React from "react";
import ReactDOMServer from "react-dom/server";
import {divIcon, LatLngExpression} from "leaflet";
import {Marker, useMap} from "react-leaflet";
import {getBusInfoLineString} from "../../lib/BusInfo.ts";


interface BusMarkerProps {
    geojson: any;
    icon?: string
    panMapToMarker: boolean
}

interface BusMarkerState {
}

export class DrawBusMarker extends React.Component<BusMarkerProps, BusMarkerState> {

    busMarker() {
        let icon = this.props.icon || "/api/bus-icons/44-512.webp"
        return (
            <div className={``}>
                <div className="marker-box marker-box-tracker">
                    <img src={icon} alt="marker"/>
                </div>
            </div>
        );
    }

    render() {
        let ls = getBusInfoLineString(this.props.geojson);
        if (ls) {
            let last = ls.geometry.coordinates[ls.geometry.coordinates.length - 1];
            if (last) {
                let latlng = [last[1], last[0]] as LatLngExpression
                let s = this.busMarker()
                let element = ReactDOMServer.renderToString(s)
                let divIcon1 = divIcon({className: '', html: element, iconAnchor: [0, 35]})
                let map = useMap()
                if (this.props.panMapToMarker) {
                    map.panTo(latlng);
                }
                return (
                    <Marker position={latlng} icon={divIcon1}/>
                )
            }
        }
    }
}
