
import React from "react";
import {getBusInfoLineString} from "../../lib/BusInfo.ts";
import {PointMarker} from "../tracker/PointMarker.tsx";


interface PointMarkersProps {
    geojson: any;
}

const DEFAULT_CLOSE_TOLERANCE_KM = 0.1

export class PointMarkers extends React.Component<PointMarkersProps, { }> {

    getDistanceFromLatLonInKm([lon1, lat1]: [number, number], [lon2, lat2]: [number, number]): number {
        function deg2rad(deg: number): number {
            return deg * (Math.PI / 180)
        }

        let R = 6371; // Radius of the earth in km
        let dLat = deg2rad(lat2 - lat1);  // deg2rad below
        let dLon = deg2rad(lon2 - lon1);
        let a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }


    getPointMarkers() {
        let fs = this.props.geojson?.features as (any[] | undefined)
        let features = fs?.filter((f: any) => f.geometry.type === "Point" && !f.properties.ignore)
        let ls = getBusInfoLineString(this.props.geojson)
        if (ls && features && ls.geometry.coordinates.length > 0) {
            let start = ls.geometry.coordinates[0]
            let dest = ls.geometry.coordinates[ls.geometry.coordinates.length - 1]
            let hasStart = false
            let hasDest = false
            features.forEach((f: any, i: number) => {
                hasStart ||= i === 0 && this.getDistanceFromLatLonInKm(start, f.geometry.coordinates) < DEFAULT_CLOSE_TOLERANCE_KM
                hasDest ||= i === features!.length - 1 && this.getDistanceFromLatLonInKm(dest, f.geometry.coordinates) < DEFAULT_CLOSE_TOLERANCE_KM
            })
            if (!hasDest) {
                let last = {type: "Feature", properties: {}, geometry: {type: "Point", coordinates: dest}}
                features.push(last)
            }
            if (!hasStart) {
                let first = {type: "Feature", properties: {}, geometry: {type: "Point", coordinates: start}}
                features = [first, ...features]
            }

            function getC(i: number) {
                return (i === 0) ? "marker-start" : (i === features!.length - 1) ? "marker-destination" : "marker-waypoint"
            }

            return (
                <div className={"pointList"}>
                    {features.map((f: any, i: number) => <PointMarker className={getC(i)} key={i} feature={f}/>)}
                </div>
            )
        }
        return null

    }

    render() {
        return this.getPointMarkers()
    }

}
