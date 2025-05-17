import {getBusInfoTitle} from "../../lib/BusInfo.ts"
import React from "react";
import {Helmet} from "react-helmet"
import {MapElement} from "./MapElement.tsx";
import "./TrackerPage.css"

interface TrackerProps {
    geojson: any
}

export class TrackerPage extends React.Component<TrackerProps> {

    render() {
        let name = getBusInfoTitle(this.props.geojson)
        return (
            <div suppressHydrationWarning={true} className={"container"}>
                <Helmet>
                    <meta charSet="utf-8"/>
                    <link rel="icon" href="https://glitch.com/favicon.ico"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <meta property="og:updated_time" content="1686368955"/>
                    <meta property="og:type" content="website"/>
                </Helmet>
                <div className={"polar center"}>
                    <div className={"map-title"}>{name}</div>
                    <div>Dr. Polar Humenn</div>
                </div>
                <MapElement geojson={this.props.geojson} editor={false} enableTracker={false}/>
            </div>
        )
    }
}
