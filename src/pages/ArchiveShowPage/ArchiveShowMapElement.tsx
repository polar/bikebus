// noinspection SpellCheckingInspection

import React from "react";
import {MapContainer, TileLayer} from "react-leaflet";
import "../tracker/MapElement.css"
import L from "leaflet";
import * as G from "../../lib/GeoJSON";
import {SvgIcon} from "@mui/material";
import {PointMarkers} from "../DrawPage/PointMarkers.tsx";
import {RouteLine} from "../DrawPage/RouteLine.tsx";

interface DrawShowMapElementProps {
    name: string
    prefix: string
    geojson: any
}

interface DrawShowMapElementState {
}

export class ArchiveShowMapElement extends React.Component<DrawShowMapElementProps, DrawShowMapElementState> {

    state : DrawShowMapElementState = {
    }

    myRef: React.Ref<typeof MapContainer>
    constructor(props: DrawShowMapElementProps) {
        super(props);
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
        if (this.props.geojson) {
            return G.getBounds(this.props.geojson).map(x => [...x].reverse()) as L.LatLngTuple[]
        } else {
            return [[43.0,-74.3],[43.1, -74.2]] as L.LatLngTuple[]
        }
    }

    mapReference : any

    setupMapEvent(map: any) {
        if (map) {
            this.mapReference = map
        }
    }

    render() {
        let bounds = this.getBounds()
        let self = this

        setTimeout(() => {
            let bounds = self.getBounds()
            self.mapReference?.fitBounds(bounds)
        }, 100)
        return (
            <MapContainer ref={(ref) => this.setupMapEvent(ref)}
                          attributionControl={true} style={{height: "100vh"}}
                          bounds={bounds}
                          zoomControl={false}
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
                <RouteLine geojson={this.props.geojson} />
                <PointMarkers geojson={this.props.geojson}/>
            </MapContainer>
        )
    }
}

