import React from "react";
import {Helmet} from "react-helmet"
import {MapElement} from "../tracker/MapElement.tsx";
import {getBusInfoTitle} from "../../lib/BusInfo.ts";

interface OperatorPageProps {
    geojson: any
}
export class OperatorPage extends React.Component<OperatorPageProps> {

    render() {
        let name = getBusInfoTitle(this.props.geojson);
        return (
            <div suppressHydrationWarning={true} className={"container"}>
                <Helmet>
                    <meta charSet="utf-8"/>
                    <link rel="icon" href="https://glitch.com/favicon.ico"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <meta property="og:updated_time" content="1686368955"/>
                    <meta property="og:type" content="website"/>

                    <title>Bike Bus Tracker</title>
                </Helmet>
                <div className={"polar center"}>
                    <div className={"map-title"}>{name}</div>
                    <div>Dr. Polar Humenn</div>
                </div>
                <MapElement enableTracker={true} editor={false} geojson={this.props.geojson}/>
            </div>
        )
    }
}
