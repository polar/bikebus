import React from "react";
import "./TrackerControl.css"
import {BusLocation} from "./BusMarker.tsx";

interface TrackerControlProps {
    geojson: any
}

interface TrackerControlState {
    active: boolean
}

export class TrackerControl extends React.Component<TrackerControlProps, TrackerControlState> {

    state: TrackerControlState = {
        active: false
    }

    name: string =  "notsupposedtohappen"
    constructor(props: TrackerControlProps) {
        super(props);
        if (this.props.geojson.features) {
            let ls = this.props.geojson.features.find((f:any) => f.type === "Feature" && f.geometry.type === "LineString");
            if (ls && ls.properties.title) {
                this.name = ls.properties.title.replaceAll(" ", "_")
            }
        }
    }

    async deleteLocation() {
        return fetch(`/api/tracker/${this.name}/location`, {
            method: "DELETE"
        })
    }

    toggle() {
        this.setState({active: !this.state.active})
        this.busLocation = undefined
        if (!this.state.active) {
            this.enableLocation()
        } else {
            this.deleteLocation().then(() => {})
            if (this.geoLocationId)
                navigator.geolocation.clearWatch(this.geoLocationId)
        }
    }

    intervalId? : number

    busLocation?: BusLocation

    success(pos:any) {
        this.busLocation = {
            timestamp: pos.timestamp,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
        }
    }

    error(err: any) {
        console.error(`ERROR(${err.code}): ${err.message}`);
    }

    geoLocationId? : number

    enableLocation() {
        let options = {
            enableHighAccuracy: true,
            //timeout: 5000,
            maximumAge: 5000,
        };

        this.geoLocationId = navigator.geolocation.watchPosition(this.success.bind(this), this.error, options);
    }

    componentDidMount() {

        // @ts-ignore
        this.intervalId = setInterval(() => {
            if (this.state.active && this.busLocation) {
                fetch(`/api/tracker/${this.name}/location`, {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(this.busLocation)
                })
                this.busLocation = undefined
            }
        }, 1000)
    }

    componentWillUnmount() {
        if (this.geoLocationId) {
            navigator.geolocation.clearWatch(this.geoLocationId);
        }
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }


    render() {
        let self = this
        return (
            <div className={"topright"}>
                <div className="center">
                    <button className={"leaflet-control go-button" + (this.state.active ? " pulse": "")} onClick={() => {self.toggle()}}>GO</button>
                </div>
            </div>
        )
    }
}
