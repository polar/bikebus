
import React from "react";
import ReactDOMServer from "react-dom/server";
import L, {divIcon} from "leaflet";
import {Marker} from "react-leaflet";
import {BusInfo} from "../../lib/BusInfo.ts";

export interface Coordinates {
    latitude: number,
    longitude: number
}

export interface BusLocation extends Coordinates {
    timestamp: number
}

interface BusMarkerProps {
    busInfo: BusInfo,
}

interface BusMarkerState {
    location?: BusLocation;
}


export class BusMarker extends React.Component<BusMarkerProps, BusMarkerState> {

    state: BusMarkerState = {}

    busMarker(location: BusLocation){
        let icon = this.props.busInfo.busIcon || "/api/44-512.webp"

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

    // @ts-ignore
    intervalId: number = setInterval(() => {})


    componentDidMount() {
        // @ts-ignore
        this.intervalId = setInterval(() => {
            fetch(`/api/tracker/${this.props.busInfo.name}/location`)
                .then(res =>
                    res.ok ?
                        res.json().then( data => this.setState({location: data}))
                        : this.setState({location: undefined}))
                .catch(error => {
                    this.setState({location: undefined});
                    console.log(error)
                });
        }, 10000)
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
            return (
                <Marker position={coordinates as L.LatLngTuple} icon={divIcon1}/>
            )
        } else {
            return null
        }


    }
}
