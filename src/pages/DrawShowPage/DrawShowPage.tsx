import React from "react";
import {Helmet} from "react-helmet"
import {DrawShowMapElement} from "./DrawShowMapElement.tsx";
import {Button, ButtonGroup, SvgIcon} from "@mui/material";
import "./DrawsShowPage.css"

interface DrawShowProps {
    name: string
    prefix: string
}

interface DrawShowState {
}

const ROUTE_URL = "https://maps.openrouteservice.org"
export class DrawShowPage extends React.Component<DrawShowProps, DrawShowState> {

    state: DrawShowState = {}

    constructor(props: DrawShowProps) {
        super(props);
    }

    Download(name: string) {
        return (
                <Button className={"download-button"} download={`${name}.json`} href={`/api/draws/${name}`}>
                    <SvgIcon>
                        <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><g><rect fill="none" height="24" width="24"/></g><g><path d="M5,20h14v-2H5V20z M19,9h-4V3H9v6H5l7,7L19,9z"/></g></svg>
                    </SvgIcon>
                </Button>
        )
    }

    DirectionsIcon() {
        return (
            <Button className={"route-button"} href={ROUTE_URL}>
                <SvgIcon style={{ marginBottom: "-5px", marginRight: "10px" , marginLeft: "10px" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="#1f1f1f"><g><rect fill="none" height="24" width="24"/></g><g><path d="m21.41 10.59-7.99-8c-.78-.78-2.05-.78-2.83 0l-8.01 8c-.78.78-.78 2.05 0 2.83l8.01 8c.78.78 2.05.78 2.83 0l7.99-8c.79-.79.79-2.05 0-2.83zM13.5 14.5V12H10v3H8v-4c0-.55.45-1 1-1h4.5V7.5L17 11l-3.5 3.5z"/></g></svg>
                </SvgIcon>
            </Button>
        )
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
                        <div className={"map-title"}><a href={"/draws"}>Draws</a></div>
                        <h2 className={"draw-name"}>{this.props.name}</h2>
                        <ButtonGroup className="navigation-buttons" orientation={"horizontal"}>
                            {this.Download(this.props.name)}
                            {this.DirectionsIcon()}
                        </ButtonGroup>
                        <DrawShowMapElement prefix={this.props.prefix} name={this.props.name}/>
                    </div>
                </div>
            </div>
        )
    }
}
