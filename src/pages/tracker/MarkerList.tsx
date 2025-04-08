
import {StopMarker} from "./stop-marker.tsx";
import React from "react";
import {Stop} from "../../stop.ts";
import {MapDiv} from "./MapDiv.tsx";

interface MarkerListProps {
    stops: Stop[]
    map: MapDiv | null
}

interface MarkerListState {
    stops: Stop[]
}

export class MarkerList extends React.Component<MarkerListProps, MarkerListState> {

    constructor(props: MarkerListProps) {
        super(props);
    }

    render() {
        return (
            <div>
                {
                    (this.props.map != null) ?
                    this.props.stops.map((stop, index) => <StopMarker map={this.props.map!} stop={stop} index={index}/>) : null
                }
            </div>
        )}

}
