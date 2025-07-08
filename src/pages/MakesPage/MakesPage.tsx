import React from "react";
import {Helmet} from "react-helmet"
import {MakesList} from "./MakesList.tsx";
import {ButtonGroup, ListItemButton} from "@mui/material";

interface MakesListPage {
    prefix: string
}

interface MakesPageState {
}

export class MakesPage extends React.Component<MakesListPage, MakesPageState> {

    state: MakesPageState = {}

    constructor(props: MakesListPage) {
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
                        <h1 className={"map-title"}>Current Routes</h1>
                        <ButtonGroup orientation={"horizontal"} className={"button-group"}>
                            <ListItemButton href={`${this.props.prefix}/home`}>Home</ListItemButton>
                            <ListItemButton href={`${this.props.prefix}/make`}>Make</ListItemButton>
                            <ListItemButton href={`${this.props.prefix}/draws`}>Draws</ListItemButton>
                            <ListItemButton href={`${this.props.prefix}/archive`}>Archive</ListItemButton>
                        </ButtonGroup>
                        <MakesList  prefix={this.props.prefix}/>
                    </div>
                </div>
            </div>
        )
    }
}
