import React from "react";
import {Helmet} from "react-helmet"
import {DrawMapElement} from "./DrawMapElement.tsx";
import {Button, ButtonGroup} from "@mui/material";
import "./DrawerPage.css"

interface DrawerPageProps {
    name?: string
    enableTracker: boolean
    prefix: string
}

interface DrawerPageState {
    name?: string
}

export class DrawerPage extends React.Component<DrawerPageProps, DrawerPageState> {

    state: DrawerPageState = {}

    constructor(props: DrawerPageProps) {
        super(props);
        this.state.name = props.name
    }

    onClick() {
        fetch(`/api/draw/hello?not=${this.state.name}`)
            .then(response => response.json())
            .then(data => {
                window.location.href = `/${this.props.prefix}draw/${data.name}`
            })
    }

    // componentDidMount() {
    //     fetch(`/api/draw/hello`)
    //         .then(response => response.json())
    //         .then(data => {
    //             if (data.message) {
    //                 console.error(data.message)
    //             }
    //         })
    //         .catch((error: any) => {
    //             console.error(error)
    //         })
    // }
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

                    <title>Bike Bus Tracker</title>
                </Helmet>
                <div className={"container"}>
                    <div className={"polar center"}>
                        <div className={"map-title"}>Draw</div>
                        {
                            this.state.name &&
                            <div>
                                <div>You are recording as:</div>
                                <div>{this.state.name}</div>
                            </div>
                        }
                    </div>
                    <DrawMapElement prefix={this.props.prefix} enableTracker={this.props.enableTracker} name={this.state.name} onNameChange={(name: string) => {self.setState({name: name})}}/>

                    <ButtonGroup className={"float-bottom dark raise-over-map"}>
                        <Button onClick={() => this.onClick()}>New</Button>
                    </ButtonGroup>
                </div>
            </div>
        )
    }
}
