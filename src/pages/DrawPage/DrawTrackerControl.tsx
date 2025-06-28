import React from "react";
import "../tracker/TrackerControl.css"
import {BusLocation} from "../tracker/BusMarker.tsx";

interface DrawTrackerControlProps {
    onNameChange?:(name: string) => void
}

interface DrawTrackerControlState {
    name?: string
    active: boolean
}

const UPDATE_LOCATION_INTERVAL_SECONDS = 1
export class DrawTrackerControl extends React.Component<DrawTrackerControlProps, DrawTrackerControlState> {

    state: DrawTrackerControlState = {
        active: false
    }


    async deleteLocation() {
        if (this.state.name) {
            return fetch(`/api/draw/${this.state.name}/location`, {
                method: "DELETE"
            })
        }
    }

    toggle() {
        this.busLocation = undefined
        if (!this.state.active) {
            this.enableLocation()
            this.setState({ active: true }, () => {
                if (this.state.name) {
                    return this.enableLocation()
                } else {
                    fetch(`/api/draw/hello`)
                        .then(res => res.json())
                        .then(data => {
                            this.setState({name: data.name})
                            // toggle will only get hit if enableTracker is true.
                            this.props.onNameChange && this.props.onNameChange(data.name)
                        })
                }
            })
        } else {
            this.deleteLocation().then(() => {})
            if (this.geoLocationId)
                navigator.geolocation.clearWatch(this.geoLocationId)
            this.setState({active: false})
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
            maximumAge: 0,
        };

        this.geoLocationId = navigator.geolocation.watchPosition(this.success.bind(this), this.error, options);
    }

    componentDidMount() {

        // @ts-ignore
        this.intervalId = setInterval(() => {
            if (this.state.active && this.state.name && this.busLocation) {
                fetch(`/api/draw/${this.state.name}/location`, {
                    method: "POST",
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(this.busLocation)
                })
                this.busLocation = undefined
            }
        }, 1000 * UPDATE_LOCATION_INTERVAL_SECONDS)
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
