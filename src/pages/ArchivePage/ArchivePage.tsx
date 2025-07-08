import React from "react";
import {Helmet} from "react-helmet"
import {ArchiveList} from "./ArchiveList.tsx";
import {ButtonGroup, ListItemButton} from "@mui/material";

interface ArchivePageProps {
    prefix: string
}

interface ArchivePageState {
}

export class ArchivePage extends React.Component<ArchivePageProps, ArchivePageState> {

    state: ArchivePageState = {}

    constructor(props: ArchivePageProps) {
        super(props);
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
                    <div className={"polar center "}>
                        <h1 className={"map-title"}>Archived Routes</h1>
                        <ButtonGroup orientation={"horizontal"} className={"button-group"}>
                            <ListItemButton href={`${this.props.prefix}/home`}>Home</ListItemButton>
                            <ListItemButton href={`${this.props.prefix}/make`}>Make</ListItemButton>
                            <ListItemButton href={`${this.props.prefix}/makes`}>Routes</ListItemButton>
                            <ListItemButton href={`${this.props.prefix}/draws`}>Draws</ListItemButton>
                        </ButtonGroup>
                        <ArchiveList prefix={this.props.prefix}/>
                    </div>
                </div>
            </div>
        )
    }
}
