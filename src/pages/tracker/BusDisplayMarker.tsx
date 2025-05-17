
import React from "react";
import ReactDOMServer from "react-dom/server";
import L, {divIcon} from "leaflet";
import {Marker} from "react-leaflet";

export interface Coordinates {
    latitude: number,
    longitude: number
}

export interface BusLocation extends Coordinates {
    timestamp: number
}

interface BusDisplayMarkerProps {
    geojson: any
}


/**
 * This BusDisplayMarker puts the specified busIcon in the GeoJSON LineString on the
 * first LineString coordinates. Used with the editor. It has no dynamic qualities.
 */
export class BusDisplayMarker extends React.Component<BusDisplayMarkerProps, { } > {

    constructor(props: any) {
        super(props);
    }

    getLocation() : BusLocation {
        let first = this.props.geojson.features.find((f: any) => f.type === "Feature" && f.geometry.type === "LineString");
        if (first) {
            return {
                longitude: first.geometry.coordinates[0][0],
                latitude: first.geometry.coordinates[0][1],
                timestamp: new Date().getTime()
            }
        }
        return {longitude: -76.127325, latitude: 43.041167, timestamp: new Date().getTime()}
    }

    busMarker(location: BusLocation) {
        let icon = "/api/bus-icons/44-512.webp"
        let ls = this.props.geojson.features.find((f:any) => f.type === "Feature" && f.geometry.type === "LineString");
        if (ls && ls.properties.busIcon) {
            icon = ls.properties.busIcon
        }

        return (
            <div className={``}>
                <div className="marker-box marker-box-tracker">
                    <img src={icon} alt="marker"/>
                </div>
                <div className="">
                    <div><b>{new Date(location.timestamp).toLocaleTimeString()}</b></div>
                </div>
            </div>
        );
    }

    render() {
        let location = this.getLocation()
        let element = ReactDOMServer.renderToString(this.busMarker(location));
        let coordinates = [location.latitude, location.longitude]
        let divIcon1 = divIcon({className: '', html: element, iconAnchor: [0,35]})
        return (
            <Marker position={coordinates as L.LatLngTuple} icon={divIcon1}/>
        )
    }
}
