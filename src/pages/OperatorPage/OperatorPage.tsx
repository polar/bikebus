import React from "react";
import {Helmet} from "react-helmet"
import {MapElement} from "../tracker/MapElement.tsx";
import {getBusInfoTitle} from "../../lib/BusInfo.ts";

interface OperatorPageProps {
    geojson: any
}
export class OperatorPage extends React.Component<OperatorPageProps> {

    componentDidMount() {
        let name = getBusInfoTitle(this.props.geojson)
        fetch(`/api/tracker/${name}/hello?type=operator`)
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    console.error(data.message)
                }
            })
            .catch((error: any) => {
                console.error(error)
            })
    }
    render() {
        let name = getBusInfoTitle(this.props.geojson);
        return (
            <div suppressHydrationWarning={true}>
                <Helmet>
                    <meta charSet="utf-8"/>
                    <link rel="icon" href="https://glitch.com/favicon.ico"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <meta property="og:updated_time" content="1686368955"/>
                    <meta property="og:type" content="website"/>

                    <title>Bike Bus Tracker</title>
                </Helmet>
                <div className={"container"}>
                    <div className={"polar center"}>
                        <div className={"map-title"}>{name}</div>
                        <div>Dr. Polar Humenn</div>
                    </div>
                    <MapElement enableTracker={true} editor={false} geojson={this.props.geojson}/>
                </div>
            </div>
        )
    }
}
