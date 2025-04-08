import {Stop} from "./stop";

export type Bounds = { bottomLeft: number[], topRight: number[] };

export interface BusInfo {
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
    globalMarkerClass: string,
    stops: Stop[],
}
