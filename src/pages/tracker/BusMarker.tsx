import React from "react";
import ReactDOMServer from "react-dom/server";
import L, {divIcon, LatLngExpression} from "leaflet";
import {Marker, useMap} from "react-leaflet";
import {getBusInfoLineString} from "../../lib/BusInfo.ts";

export interface Coordinates {
    latitude: number,
    longitude: number
}

export interface BusLocation extends Coordinates {
    timestamp: number
}

interface BusMarkerProps {
    geojson: any,
    panMapToMarker: boolean
}

interface BusMarkerState {
    location?: BusLocation;
}

const UPDATE_LOCATION_INTERVAL_SECONDS = 10

export class BusMarker extends React.Component<BusMarkerProps, BusMarkerState> {

    state: BusMarkerState = {}

    name : string = "notsupposedtohappen"

    constructor(props: BusMarkerProps) {
        super(props);
        if (this.props.geojson.features) {
            let ls = this.props.geojson.features.find((f:any) => f.type === "Feature" && f.geometry.type === "LineString");
            if (ls && ls.properties.title) {
                this.name = ls.properties.title.replaceAll(" ", "_")
            }
        }
    }
    busMarker(location: BusLocation){
        let icon = "/api/bus-icons/44-512.webp'"
        let ls = getBusInfoLineString(this.props.geojson)
        if (ls && ls.properties.busIcon) {
            icon = ls.properties.busIcon
        }
        let time = new Date(location.timestamp).toLocaleTimeString()
        return (
            <div className={``}>
                <div className="marker-box marker-box-tracker">
                    <img src={icon} alt="marker"/>
                </div>
                <div className="">
                    <div><b>{time}</b></div>
                </div>
            </div>
        );
    }

    // @ts-ignore
    intervalId: number = setInterval(() => {})


    componentDidMount() {
        // @ts-ignore
        this.intervalId = setInterval(() => {
            fetch(`/api/tracker/${this.name}/location`)
                .then(res =>
                    res.ok ?
                        res.json().then( data => this.setState({location: data}))
                        : this.setState({location: undefined}))
                .catch(error => {
                    this.setState({location: undefined});
                    console.log(error)
                });
        }, 1000 * UPDATE_LOCATION_INTERVAL_SECONDS);
    }
    componentWillUnmount() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    render() {
        if (this.state.location) {
            let s = this.busMarker(this.state.location)
            let element = ReactDOMServer.renderToString(s)
            let coordinates = [this.state.location.latitude, this.state.location.longitude]
            let divIcon1 = divIcon({className: '', html: element, iconAnchor: [0,35]})
            let map = useMap()
            if (this.props.panMapToMarker) {
                map.panTo(coordinates as LatLngExpression);
            }
            return (
                <Marker position={coordinates as L.LatLngTuple} icon={divIcon1}/>
            )
        } else {
            return null
        }

    }
}
