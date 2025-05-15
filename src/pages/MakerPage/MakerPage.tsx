
import {BusInfo} from "../../lib/BusInfo.ts"
import React, {ChangeEvent} from "react";
import {Helmet} from "react-helmet"
import {MapElement} from "../tracker/MapElement";
import {GeoJSON2BusInfo} from "../../lib/GeoJSON2BusInfo"
import "../tracker/TrackerPage.css"
import {PointEditor} from "./PointEditor";
import {produce} from "immer";
import {Button, ButtonGroup, SvgIcon, TextField} from "@mui/material";
interface MakerPageProps {
}
interface MakerPageState {
    busInfo?: BusInfo;
    deleteEnabled: boolean
}
export class MakerPage extends React.Component<MakerPageProps> {

    state: MakerPageState = {
        deleteEnabled: false
    }
    myRef : React.RefObject<PointEditor|null>

    constructor(props: MakerPageProps) {
        super(props);
        this.myRef = React.createRef<PointEditor>()
    }


    handleFile(event: any) {
        let self = this
        let geoJson = JSON.parse(event.target.result)
        if (geoJson.features.length > 0) {
            let busInfo = GeoJSON2BusInfo.getBusInfo2(geoJson)
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
        let data = this.myRef.current?.getData()
        console.log(data)
        if (data) {
            fetch("/api/route", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }).then(response => {
                if (response.status === 200) {
                    alert("File has been uploaded!")
                } else if (response.status === 409) {
                    this.setState({deleteEnabled: true})
                    alert("File exists. Please delete first")
                }
            })
        }
    }

    delete() {
        let data = this.myRef.current?.getData()
        console.log(data)
        if (data) {
            let ls = data.features.find((f:any) => f.type === "Feature" && f.geometry.type === "LineString")
            if (ls && ls.properties.title) {
                let name = ls.properties.title.replaceAll(" ", "_")
                fetch(`/api/route/${name}`, {
                    method: "DELETE",
                    headers: {
                        "Accept": "text/plain",
                        "Content-Type": "text/plain"
                    }
                }).then(response => {
                    if (response.status === 200) {
                        this.setState({deleteEnabled: false})
                        alert("Route has been deleted!")
                    } else if (response.status === 403) {
                        this.setState({deleteEnabled: false})
                        alert("Route cannot be deleted!")
                    }
                })
            }
        }
    }

    handleText(event: any) {
        let busInfo = this.state.busInfo
        if (busInfo) {
            busInfo.title = event.target.value
            this.setState({busInfo: busInfo})
        }
    }
    myUpdate() {
        let geojson = this.myRef.current!.getData()
        let busInfo = this.state.busInfo
        if (busInfo) {
            this.setState({busInfo: produce(this.state.busInfo, (f:any) => {
                    f.geojson = geojson
                })})
        }
    }

    changeTitle(event: ChangeEvent<HTMLInputElement>) {
        let text = event.target.value
        if (this.state.busInfo) {
            if (this.state.busInfo.geojson) {
                let bi = produce(this.state.busInfo, (bi: any) => {
                    let ls = bi.geojson.features.find((f: any) => f.type === "Feature" && f.geometry.type === "LineString")
                    if (ls) {
                        ls.properties.title = text
                    }
                })
                this.setState({busInfo: bi})
            }
        }
    }
    render() {
        let title = "Bike Bus Route"
        if (this.state.busInfo) {
            if (this.state.busInfo.geojson) {
                let ls = this.state.busInfo.geojson.features.find((f:any) => f.type === "Feature" && f.geometry.type === "LineString")
                if (ls) {
                    if (ls.properties.title) {
                        title = ls.properties.title
                    }
                }
            }
        }
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
                <h1><a href={"/"}>Bike Bus</a> Maker Page</h1>
                <ButtonGroup>
                    <Button component="label">
                        Choose File
                        <input type="file" accept=".json" hidden onChange={this.handleChange.bind(this)} />
                    </Button>
                    <Button download="geojson.json" href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(this.state.busInfo?.geojson))}`}>
                        <SvgIcon>
                            <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><rect fill="none" height="24" width="24"/></g><g><path d="M5,20h14v-2H5V20z M19,9h-4V3H9v6H5l7,7L19,9z"/></g></svg>
                        </SvgIcon>
                    </Button>
                    <Button onClick={this.save.bind(this)}>
                        Save To Server
                    </Button>
                    { this.state.deleteEnabled ?
                        <Button onClick={this.delete.bind(this)}>
                        Delete From Server
                        </Button>
                        : null
                    }
                </ButtonGroup>
                <div className={"container"}>
                    <div className={"polar center"}>
                        <div className={"map-title"}>
                            <TextField value={title} onChange={this.changeTitle.bind(this)}></TextField>
                        </div>
                        <div>Dr. Polar Humenn</div>
                    </div>
                    { this.state.busInfo ? <PointEditor ref={this.myRef} geojson={this.state.busInfo!.geojson} onChange={this.myUpdate.bind(this)}/> : null}
                    { this.state.busInfo ? <MapElement busInfo={this.state.busInfo} enableTracker={false}/> : null}
                </div>
            </div>
        )
    }
}
