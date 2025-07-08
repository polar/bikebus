// noinspection SpellCheckingInspection

import React from "react";
import {MapContainer, TileLayer} from "react-leaflet";
import "../tracker/MapElement.css"
import L from "leaflet";
import * as G from "../../lib/GeoJSON";
import {getBusInfoTitle} from "../../lib/BusInfo.ts";
import {CenterControl} from "../tracker/CenterControl.tsx";
import {SvgIcon} from "@mui/material";
import {MyLocation, MyLocationMarker} from "../tracker/LocationMarker.tsx";
import {LocationControl} from "../tracker/LocationControl.tsx";
import {PointMarkers} from "./PointMarkers.tsx";
import {RouteLine} from "./RouteLine.tsx";
import {DrawTrackerControl} from "./DrawTrackerControl.tsx";

interface DrawMapElementProps {
    name?: string
    enableTracker: boolean
    onNameChange: (name: string) => void
    prefix: string
}

interface DrawMapElementState {
    name?: string
    geojson: any,
    panToBusMarker: boolean
    locationControl: string
}

export class DrawMapElement extends React.Component<DrawMapElementProps, DrawMapElementState> {

    state : DrawMapElementState = {
        name: undefined,
        geojson: undefined as any,
        panToBusMarker: true,
        locationControl: "location-control-on"
    }

    myRef: React.Ref<typeof MapContainer>
    constructor(props: DrawMapElementProps) {
        super(props);
        this.state.name = props.name
        this.myRef = React.createRef<typeof MapContainer>();
    }

    OpenStreetMap() {
        return (
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
        )
    }

    BikeBusMap() {
        return (
            <TileLayer
                url={'https://api.mapbox.com/styles/v1/streicherd/clkyafeqb00ki01pifykf5jp8/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3RyZWljaGVyZCIsImEiOiJjbDkxZ2JuaDQxMXRpM25vNmRjdzNlZXVzIn0.BkniqpkfdbK_szBJGdr0KQ'}
                tileSize={512} zoomOffset={-1}
                attribution='Dr. Polar Humenn'/>

        )
    }

    getBounds() {
        if (this.state.geojson) {
            return G.getBounds(this.state.geojson).map(x => [...x].reverse()) as L.LatLngTuple[]
        } else {
            return [[43.0,-74.3],[43.1, -74.2]] as L.LatLngTuple[]
        }
    }

    onCenterControlClick() {
        if (!this.state.panToBusMarker) {
            if (this.state.locationControl === "location-control-center") {
                this.setState({locationControl: "location-control-on", panToBusMarker: true})
            } else if (this.state.locationControl === "location-control-on") {
                this.setState({panToBusMarker: true})
            } else if (this.state.locationControl === "location-control-off") {
                this.setState({panToBusMarker: true})
            }
        } else {
            this.setState({panToBusMarker: false})
        }
    }

    onLocationControlClick() {
        if (this.state.locationControl === "location-control-off") {
            this.setState({locationControl: "location-control-on"})
        } else if (this.state.locationControl === "location-control-on") {
            this.setState({locationControl: "location-control-center", panToBusMarker: false})
        } else if (this.state.locationControl === "location-control-center") {
            this.setState({locationControl: "location-control-off"})
        }
    }

    lastLocation?: MyLocation

    onLocationChange(location: MyLocation) {
        this.lastLocation = location
    }

    routeIntervalID?: any

    componentDidMount() {
        this.enableLocation()
        this.routeIntervalID = setInterval(() => {
            if (this.state.name) {
                fetch(`/api/draw/${this.state.name}`)
                    .then(response => response.json())
                    .then(data => {
                        if (data) {
                            this.setState({geojson: data})
                        }
                    })
                    .catch((error: any) => {
                        console.error(error)
                    })
            }
        }, 1000*10)
    }

    componentWillUnmount() {
        clearInterval(this.routeIntervalID)
        if (this.geoLocationId) {
            navigator.geolocation.clearWatch(this.geoLocationId);
        }
    }

    mapReference : any

    setupMapEvent(map: any) {
        if (map) {
            this.mapReference = map
            map.on("dragend", (_x: any) => {
                if (this.state.locationControl === "location-control-center") {
                    this.setState({locationControl: "location-control-on"})
                }
            })
            map.on("zoomend", (_x: any) => {
                if (this.state.locationControl === "location-control-center") {
                    this.setState({locationControl: "location-control-on"})
                }
            })
        }
    }

    onNameChange(name: string) {
        this.setState({name: name})
        this.props.onNameChange(name)
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

    error(err: any) {
        console.error(err)
    }

    success(pos:any) {
        let bounds = [[pos.coords.latitude, pos.coords.longitude], [pos.coords.latitude, pos.coords.longitude]]
        if (this.mapReference) {
            this.mapReference.fitBounds(bounds)
            this.mapReference.setZoom(14)
            if (this.geoLocationId) {
                navigator.geolocation.clearWatch(this.geoLocationId);
                this.geoLocationId = undefined;
            }
        }
    }

    render() {
        let self = this
        let bounds = this.getBounds()

        let name = getBusInfoTitle(this.state.geojson) || "notsupposedtohappen"

        // setTimeout(() => {
        //     self.myRef.current.fitBounds(bounds)
        // }, 100);
        return (
            <MapContainer ref={(ref) => this.setupMapEvent(ref)}
                          attributionControl={true} style={{height: "100vh"}}
                          bounds={bounds}
                          scrollWheelZoom={true}
            >
                {
                    /**
                     * We need to use an SvgIcon explicitly, so MUI installs the propper CSS
                     * for the SvgIcons used in the map element. The problem is that the
                     * PointMarkers are dynamically generated, this.getPointMarkers(); So effectively, the declarative
                     * system does not realize that the CSS is needed for the SvgIcon inside
                     * the PointMarkers. And, apparently, the MUI system does not insert the CSS
                     * for css-xxxxx-MuiSvgIcon-root into the head of the page.
                     */
                }
                <SvgIcon style={{display:"none"}}>
                    <svg></svg>
                </SvgIcon>
                <this.BikeBusMap/>
                <RouteLine geojson={this.state.geojson} />
                <PointMarkers geojson={this.state.geojson}/>
                {/*<DrawBusMarker geojson={this.state.geojson}*/}
                {/*               panMapToMarker={this.state.panToBusMarker}/>*/}
                {
                    this.props.enableTracker &&
                    <DrawTrackerControl onNameChange={(name: string) => {self.onNameChange(name)}}/>
                }
                <CenterControl  on={this.state.panToBusMarker} onClick={() => this.onCenterControlClick()}/>
                <LocationControl  state={this.state.locationControl}
                                         onClick={() => this.onLocationControlClick()}/>
                {
                    this.state.locationControl !== "location-control-off" &&
                        <MyLocationMarker location={this.lastLocation}
                                          panMapToMarker={this.state.locationControl === "location-control-center"}
                                          onLocationChange={(l:any) => this.onLocationChange(l)}
                                          name={name}/>
                }
            </MapContainer>
        )
    }
}

