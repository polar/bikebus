
import {BusInfo} from "../../lib/BusInfo.ts";
import React from "react";
import {MapContainer, Polyline, TileLayer} from "react-leaflet";
import "./MapElement.css"
import {StopMarker} from "./StopMarker.tsx";
import L from "leaflet";
import {BusMarker} from "./BusMarker.tsx";
import {TrackerControl} from "./TrackerControl";
import * as G from "../../lib/GeoJSON";
import {PointMarker} from "./PointMarker";

interface MapElementProps {
    busInfo: BusInfo,
    enableTracker: boolean,
}

export class MapElement extends React.Component<MapElementProps, {}> {

    private myRef: React.RefObject<any>;

    constructor(props: MapElementProps) {
        super(props);

        this.myRef = React.createRef();

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
            <TileLayer url={'https://api.mapbox.com/styles/v1/streicherd/clkyafeqb00ki01pifykf5jp8/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoic3RyZWljaGVyZCIsImEiOiJjbDkxZ2JuaDQxMXRpM25vNmRjdzNlZXVzIn0.BkniqpkfdbK_szBJGdr0KQ'}
                       tileSize={512} zoomOffset={-1}
                       attribution='Dr. Polar Humenn' />

        )
    }

    getBounds() {
        if (this.props.busInfo.geojson) {
            return G.getBounds(this.props.busInfo.geojson).map(x => x.reverse()) as L.LatLngTuple[]
        }
        return [this.props.busInfo.trackerBounds.bottomLeft, this.props.busInfo.trackerBounds.topRight] as L.LatLngTuple[]
    }

    getPositions(): L.LatLngTuple[] {
        if (this.props.busInfo.geojson) {
            let ls = this.props.busInfo.geojson.features.find((f:any) => f.geometry.type === "LineString")
            if (ls) {
                return ls.geometry.coordinates.map((c:any) => c.slice(0,2).reverse() as L.LatLngTuple)
            }
            return []
        } else {
            let route = this.props.busInfo.stops.map(stop => stop.coordinates as L.LatLngTuple)
            return route
        }
    }

    getPointMarkers() {
        if (this.props.busInfo.geojson) {
            let fs = this.props.busInfo.geojson.features as any[]
            let features = fs.filter((f:any) => f.geometry.type === "Point" && !f.properties.ignore)
            return features.map((f:any, index: number) => <PointMarker key={index} feature={f}/>)
        }
        return null
    }
    renderGeoJSON() {
        let bounds = this.getBounds()

        let positions =  this.getPositions()

        return (
            <MapContainer ref={this.myRef}
                              attributionControl={true} style={{height: "100vh"}}
                          bounds={bounds}
                          scrollWheelZoom={true}
                          >
                <this.BikeBusMap/>
                <Polyline positions={positions}/>
                { this.getPointMarkers() }
                <BusMarker {...this.props} />
                { this.props.enableTracker ? <TrackerControl {...this.props}/> : null}
            </MapContainer>

        )
    }

    render() {
        if (this.props.busInfo.geojson) {
            return this.renderGeoJSON()
        }

        let stops = this.props.busInfo.stops.filter(stop => !stop.waypointOnly)
        let route = this.props.busInfo.stops.map(stop => stop.coordinates as L.LatLngTuple)
        let bounds = [this.props.busInfo.trackerBounds.bottomLeft, this.props.busInfo.trackerBounds.topRight] as L.LatLngTuple[]

        let self = this
        setTimeout(() => {
            self.myRef.current.fitBounds(bounds)
            self.myRef.current.geoJson
        }, 100);
        return (
            <MapContainer ref={this.myRef}
                attributionControl={true} style={{height: "100vh"}} bounds={bounds} scrollWheelZoom={true}>
                <this.BikeBusMap/>
                {
                    stops.map(stop => <StopMarker stop={stop}/>)
                }
                <BusMarker {...this.props} />
                <Polyline positions={route}/>
                { this.props.enableTracker ? <TrackerControl {...this.props}/> : null}
            </MapContainer>
        )
    }
}
