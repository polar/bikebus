import {ensureBusInfoTitle, getBusInfoTitle} from "../../lib/BusInfo.ts"
import React from "react";
import {Helmet} from "react-helmet"
import "../tracker/TrackerPage.css"
import {Button, ButtonGroup, ListItemButton, SvgIcon} from "@mui/material";
import {EditorElement} from "./EditorElement.tsx";

const ROUTE_URL = "https://maps.openrouteservice.org"

interface MakerPageProps {
    geojson?: any;
    name?: string
}

interface MakerPageState {
    deleteEnabled: boolean
    name?: string
    geojson?: any
    downloadHref?: string
    disableUrl: boolean
    copyMode: boolean
}

export class MakerPage extends React.Component<MakerPageProps,MakerPageState> {

    state: MakerPageState = {
        deleteEnabled: false,
        disableUrl: false,
        copyMode: false
    }

    hasName() {
        return this.props.name && this.props.name != ""
    }

    isInCopyMode() {
        return this.hasName() && this.props.geojson || this.state.copyMode
    }

    isInEditMode() {
        return !this.hasName() && this.props.geojson && !this.state.copyMode
    }

    isInMakeMode() {
        return !this.props.geojson
    }

    constructor(props: MakerPageProps) {
        super(props);
        if (props.geojson) {
            ensureBusInfoTitle(props.geojson)
            this.state.name = getBusInfoTitle(props.geojson)
            this.state.geojson = props.geojson
            this.state.deleteEnabled = false
            this.state.downloadHref = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(props.geojson))}`
        }
    }

    updateState(geojson: any) {
        ensureBusInfoTitle(geojson)
        let name = getBusInfoTitle(geojson)
        let state = {
            name: name,
            geojson: geojson,
            deleteEnabled: false,
            downloadHref: `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(geojson))}`
        }
        if (name) {
            fetch(`/api/routes/${name}.json`)
                .then(res => {
                    this.setState({disableUrl: !res.ok})
                })
        }
        this.setState(state)
    }

    handleFile(event: any) {
        let geoJson = JSON.parse(event.target.result)
        if (geoJson.features.length > 0) {
            this.updateState(geoJson)
        }
    }

    handleChangeFile(files: FileList) {
        if (files?.length > 0) {
            let file = files[0]
            let fileData = new FileReader()
            fileData.onload = (e) => this.handleFile(e)
            fileData.readAsText(file);
        }
    }

    handleChange(event: any) {
        if (event.target.files !== null) {
            this.handleChangeFile(event.target.files)
        }
    }

    copy() {
        if (this.state.geojson) {
            let name = getBusInfoTitle(this.state.geojson)
            if (name) {
                this.setState({name: name, copyMode: true})
            }
        }
    }

    save() {
        let data = this.state.geojson
        console.log(data)
        if (data) {
            ensureBusInfoTitle(data)
            let name = getBusInfoTitle(data)
            if (name) {
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
                        response.json()
                            .then(geojson => this.updateState(geojson))
                            .then(() => this.setState({copyMode: false}))
                    } else if (response.status === 409) {
                        this.setState({deleteEnabled: true})
                        alert("File exists. Please delete first")
                    }
                })
            } else {
                alert("Name cannot be left blank")
            }
        }
    }

    delete() {
        let data = this.state.geojson
        console.log(data)
        if (data) {
            let name = getBusInfoTitle(data)
            if (name) {
                fetch(`/api/route/${name}`, {
                    method: "DELETE",
                    headers: {
                        "Accept": "text/plain",
                        "Content-Type": "text/plain"
                    }
                }).then(response => {
                    if (response.status === 200) {
                        this.setState({deleteEnabled: false, disableUrl: true})
                        alert("Route has been deleted!")
                    } else if (response.status === 403) {
                        this.setState({deleteEnabled: false, disableUrl: true})
                        alert("Route cannot be deleted!")
                    }
                })
            } else {
                alert("Route cannot be deleted! Invalid Name")
            }
        }
    }

    onChange() {
        let data = this.state.geojson
        if (data) {
            this.updateState(data)
        }
    }

    ChooseFile() {
        if (this.isInCopyMode() ||this.isInMakeMode()) {
            return (
                <Button component="label">
                    Choose File
                    <input type="file" accept=".json" hidden onChange={this.handleChange.bind(this)} />
                </Button>
            )
        }
    }

    Download() {
        if (this.state.downloadHref) {
            return (
                <Button download="geojson.json" href={this.state.downloadHref}>
                    <SvgIcon>
                        <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><rect fill="none" height="24" width="24"/></g><g><path d="M5,20h14v-2H5V20z M19,9h-4V3H9v6H5l7,7L19,9z"/></g></svg>
                    </SvgIcon>
                </Button>
            )
        }
    }
    Delete() {
        if (this.state.deleteEnabled) {
            return (
                <Button onClick={this.delete.bind(this)}>
                Delete From Server
                </Button>
            )
        }
    }
    SaveToServer() {
        if (this.state.downloadHref) {
            return (
                <Button onClick={this.save.bind(this)}>
                    Save To Server
                </Button>
            )
        }
    }
    SwitchToCopyMode() {
        if (!this.isInCopyMode() && !this.isInMakeMode()) {
            return (
                <Button onClick={this.copy.bind(this)}>
                    Copy
                </Button>
            )
        }
    }
    render() {
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
                    { this.ChooseFile() }
                    { this.Download() }
                    { this.SaveToServer() }
                    { this.Delete() }
                    { this.SwitchToCopyMode() }
                    { this.state.name  && <ListItemButton disabled={this.state.disableUrl} href={`/${this.state.name}/op`}>{`/${this.state.name}/op`}</ListItemButton>}
                </ButtonGroup>
                <ButtonGroup style={{float:"right"}}>
                    <ListItemButton href={"/list"}>Edit List</ListItemButton>
                    <ListItemButton href={"/directions"}>Directions</ListItemButton>
                    <ListItemButton href={ROUTE_URL}>Create a Route File</ListItemButton>
                </ButtonGroup>
                <EditorElement editTitleEnabled={!this.isInEditMode()} geojson={this.state.geojson} onChange={this.onChange.bind(this)}/>
            </div>
        )
    }
}
