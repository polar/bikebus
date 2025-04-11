
//import {MapElement} from "./MapElement.tsx";
import {BusInfo} from "../../lib/BusInfo.ts"
import React from "react";
import {Helmet} from "react-helmet"
import {MapElement} from "../tracker/MapElement.tsx";

interface OperatorPageProps {
    busInfo: BusInfo
}
export class OperatorPage extends React.Component<OperatorPageProps> {

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
                <MapElement enableTracker={true} {...this.props}/>
            </div>
        )
    }
}
