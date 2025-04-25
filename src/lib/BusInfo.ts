import {Stop} from "./stop.ts";

export type Bounds = { bottomLeft: number[], topRight: number[] };

export interface BusInfo {
    name: string,
    ctu: boolean,
    route: string,
    title: string,
    runInfo: string,
    headerImageSrc: string,
    headerImageAlt: string,
    trackerBounds: Bounds,
    minZoomLevel: number,
    mapHeight: number,
    color: string,
    busIcon?: string,
    globalMarkerClass: string,
    stops: Stop[],
}
