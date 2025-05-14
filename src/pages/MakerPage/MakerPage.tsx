
import {BusInfo} from "../../lib/BusInfo.ts"
import React from "react";
import {Helmet} from "react-helmet"
import {MapElement} from "../tracker/MapElement.tsx";
import {GeoJSON2BusInfo} from "../../lib/GeoJSON2BusInfo.ts"
import "../tracker/TrackerPage.css"
interface MakerPageProps {
}
interface MakerPageState {
    busInfo?: BusInfo;
}
export class MakerPage extends React.Component<MakerPageProps> {

    state: MakerPageState = {}

    handleFile(event: any) {
        let self = this
        let geoJson = JSON.parse(event.target.result)
        if (geoJson.features.length > 0) {
            let busInfo = GeoJSON2BusInfo.getBusInfo(geoJson)
            if (busInfo) {
                self.setState({busInfo: busInfo})
            }
        }
    }

    handleChangeFile(files: FileList) {
        if (files?.length > 0) {
            let file = files[0]
            let fileData = new FileReader();
            fileData.onload = (e) => this.handleFile(e);
            fileData.readAsText(file);
        }
    }

    handleChange(event: any) {
        if (event.target.files !== null) {
            this.handleChangeFile(event.target.files)
        }
    }

    getMapElement() {
        if (this.state.busInfo) {
            return (
                <MapElement busInfo={this.state.busInfo} enableTracker={false}/>
            )
        }
    }

    save() {

    }

    handleText(event: any) {
        let busInfo = this.state.busInfo
        if (busInfo) {
            busInfo.title = event.target.value
            this.setState({busInfo: busInfo})
        }
    }
    render() {
        let self = this
        return (
            <div suppressHydrationWarning={true}>
                <Helmet>
                    <meta charSet="utf-8"/>
                    <link rel="icon" href="https://glitch.com/favicon.ico"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1"/>
                    <meta property="og:updated_time" content="1686368955"/>
                    <meta property="og:type" content="website"/>

                    <title>Bike Bus Maker Page</title>
                </Helmet>
                <h1>Bike Bus Maker Page</h1>
                <input type="file" accept=".json" onChange={e => self.handleChange(e)}/>
                <h2>Name</h2>
                <input type={"text"} onChange={e => self.handleText(e)}/>
                <button onClick={() => {self.save()}}>Save</button>
                <div>
                    <div className={"polar center"}>
                        <div className={"map-title"}>{this.state.busInfo?.title}</div>
                        <div>Dr. Polar Humenn</div>
                    </div>
                    { this.state.busInfo ? <MapElement busInfo={this.state.busInfo}/> : null}
                </div>
            </div>
        )
    }
}
