
import {BusInfo} from "../../BusInfo.ts";
import React from "react";
import {MapContainer, Marker} from "react-leaflet";
import "./MapElement.css"
import L, {icon} from "leaflet";
interface MapElementProps {
    busInfo: BusInfo
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
    // render() {
    //     return (
    //         <>
    //             <h1>{this.props.busInfo.title}</h1>
    //             <MapDiv ref={this.map_div} {...this.props}/>
    //             <MarkerList map={this.map_div.current} stops={this.state.busInfo.stops.filter(stop => !stop.waypointOnly)}/>
    //
    //             <h2>{this.props.busInfo.runInfo}</h2>
    //         </>
    //     )
    // }

    render() {
        let stops = this.props.busInfo.stops.filter(stop => !stop.waypointOnly)
        return (
            <MapContainer bounds={this.state.bounds} zoom={15} scrollWheelZoom={true}>
                {
                    stops.map(
                        (stop, i) => {
                            let img =  stop.icon || "https://cdn.glitch.global/6ba8c1b0-9df4-482f-9009-77d10d780dbb/bus_stop_circle.svg?v=1664245520908"
                            let stopIcon = icon({iconUrl: img, iconSize: [20, 20]})
                            return (
                                <Marker position={stop.coordinates as L.LatLngTuple} key={`stop-marker-${i}`} icon={stopIcon} eventHandlers={{click: () => {alert("Clicked!")}}}>

                                        <div className="marker-box">
                                            <div>
                                                <b>{stop.name}</b>
                                                <br/>
                                                {stop.subtitle && <div>{stop.subtitle}</div>}
                                            </div>
                                        </div>
                                </Marker>
                            )
                        }
                    )
                }
            </MapContainer>
        )
    }
}
