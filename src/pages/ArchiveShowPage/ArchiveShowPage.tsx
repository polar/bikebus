import React from "react";
import {Helmet} from "react-helmet"
import {ArchiveShowMapElement} from "./ArchiveShowMapElement.tsx";
import {Button, ButtonGroup, ListItemButton, SvgIcon} from "@mui/material";
import "./ArchiveShowPage.css"
import {GeoJSONProcessor} from "../../process/GeoJSONProcessor.ts";

interface ArchiveShowProps {
    name: string
    prefix: string
}

interface ArchiveShowState {
    geojson?: any
    downloadHref?: string
}

interface DownloadButtonProps {
    href: string
    name: string
}

class DownloadButton extends React.Component<DownloadButtonProps,{}> {
    render() {
        return (
            <Button className={"download-button"} download={`${this.props.name}.json`} href={this.props.href} title={"Download"}>
                <SvgIcon>
                    <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24"
                         viewBox="0 0 24 24" width="24">
                        <g>
                            <rect fill="none" height="24" width="24"/>
                        </g>
                        <g>
                            <path d="M5,20h14v-2H5V20z M19,9h-4V3H9v6H5l7,7L19,9z"/>
                        </g>
                    </svg>
                </SvgIcon>
            </Button>
        )
    }
}

const ROUTE_URL = "https://maps.openrouteservice.org"
export class ArchiveShowPage extends React.Component<ArchiveShowProps, ArchiveShowState> {

    state: ArchiveShowState = {}

    constructor(props: ArchiveShowProps) {
        super(props);
    }

    updateState(geojson: any) {
        let href = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(geojson))}`
        this.setState({geojson: geojson, downloadHref: href})
    }

    refine() {
        if (this.state.geojson) {
            let g2 = new GeoJSONProcessor(this.props.name, this.state.geojson).refine()
            if (g2) {
                this.updateState(g2)
            }
        }
    }

    refineButton() {
        return (
            <Button className={"route-button"} onClick={() => this.refine()} title={"Refine"}>
                <SvgIcon>
                    <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><rect fill="none" height="24" width="24"/></g><g><path d="M19,19H5V5h7V3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2v-7h-2V19z M19,17H5v-6h14V17z"/></g></svg>
                </SvgIcon>
            </Button>
        )
    }

    DirectionsIcon() {
        return (
            <Button className={"route-button"} href={ROUTE_URL} title={"OSM Edit"}>
                <SvgIcon style={{ marginBottom: "-5px", marginRight: "10px" , marginLeft: "10px" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#1f1f1f"><g><rect fill="none" height="24" width="24"/></g><g><path d="m21.41 10.59-7.99-8c-.78-.78-2.05-.78-2.83 0l-8.01 8c-.78.78-.78 2.05 0 2.83l8.01 8c.78.78 2.05.78 2.83 0l7.99-8c.79-.79.79-2.05 0-2.83zM13.5 14.5V12H10v3H8v-4c0-.55.45-1 1-1h4.5V7.5L17 11l-3.5 3.5z"/></g></svg>
                </SvgIcon>
            </Button>
        )
    }

    componentDidMount() {
        fetch(`/api/archive/${this.props.name}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    this.updateState(data)
                }
            })
            .catch((error: any) => {
                console.error(error)
            })
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

                    <title>Bike Bus</title>
                </Helmet>
                <div className={"container"}>
                    <div className={"polar center"}>
                        <h1>Archived Route</h1>
                        <ButtonGroup orientation={"horizontal"} className={"home-buttons"}>
                            <ListItemButton href={`${this.props.prefix}/home`}>Home</ListItemButton>
                            <ListItemButton href={`${this.props.prefix}/make`}>Make</ListItemButton>
                            <ListItemButton href={`${this.props.prefix}/makes`}>Routes</ListItemButton>
                            <ListItemButton href={`${this.props.prefix}/draws`}>Draws</ListItemButton>
                            <ListItemButton href={`${this.props.prefix}/archive`}>Archive</ListItemButton>
                        </ButtonGroup>
                        <h3 className={"draw-name"}>{this.props.name}</h3>
                        <ButtonGroup className="navigation-buttons" orientation={"horizontal"}>
                            {this.refineButton()}
                            {this.state.downloadHref && <DownloadButton href={this.state.downloadHref} name={this.props.name}/>}
                            {this.DirectionsIcon()}
                        </ButtonGroup>
                        <ArchiveShowMapElement prefix={this.props.prefix} name={this.props.name} geojson={this.state.geojson}/>
                    </div>
                </div>
            </div>
        )
    }
}
