import {TrackerHead} from "./tracker-head.tsx";
import {MapElement} from "./MapElement.tsx";
import {BusInfo} from "../../BusInfo.ts"
import React from "react";

interface TrackerProps {
    busInfo: BusInfo
}
export class TrackerPage extends React.Component<TrackerProps> {

    constructor(props: TrackerProps) {
        super(props);
    }

    render() {
        return (
            <div>
                <head>
                    <TrackerHead {...this.props}/>
                </head>
                <body>
                <MapElement {...this.props}/>
                </body>

            </div>
        )
    }
}
