
import {BusInfo} from "../../lib/BusInfo.ts"
import React from "react";
import {Helmet} from "react-helmet"
import {MapElement} from "./MapElement.tsx";

interface TrackerProps {
    busInfo: BusInfo
}

export class TrackerPage extends React.Component<TrackerProps> {

    render() {
        return (
            <div suppressHydrationWarning={true}>
                <Helmet>
                    <meta charSet="utf-8"/>
                    <link rel="icon" href="https://glitch.com/favicon.ico"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <meta property="og:updated_time" content="1686368955"/>
                    <meta property="og:title" content={this.props.busInfo.title}/>
                    <meta property="og:type" content="website"/>

                    <title>{this.props.busInfo.title} Bike Bus Tracker</title>
                </Helmet>
                <MapElement {...this.props} enableTracker={false}/>
            </div>
        )
    }
}
