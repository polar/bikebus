import React from "react";
import {MakerPage} from "./MakerPage.tsx";
import {Button, ButtonGroup} from "@mui/material";
import {ensureBusInfoTitle} from "../../lib/BusInfo.ts";

interface LoadPageProps {
    name?: string
    copy: boolean
}

interface LoadPageState {
    geojson?: any
    error?: string
}

export class LoadPage extends React.Component<LoadPageProps, LoadPageState> {

    state: LoadPageState = {}

    constructor(props:LoadPageProps) {
        super(props);
    }

    componentDidMount(){
        if (this.props.name && this.props.name != "") {
            fetch(`/api/routes/${this.props.name}.json`)
                .then(response => response.json())
                .then(data => {
                    if (data.features) {
                        ensureBusInfoTitle(data)
                        this.setState({geojson: data})
                    }
                })
                .catch((error: any) => {
                    console.error(error)
                    this.setState({error: error})
                })
        }

    }

    render() {
        if (this.props.name && this.props.name != "") {
            if (this.state.geojson) {
                if (this.props.copy) {
                    return (
                        <MakerPage geojson={this.state.geojson} name={this.props.name}/>
                    )
                } else {
                    return (
                        <MakerPage geojson={this.state.geojson}/>
                    )
                }
            }
            if (this.state.error != "") {
                return <div><div>Error getting {this.props.name},  {this.state.error}</div>
                <ButtonGroup>
                    <Button href={"/make"}>Make</Button>
                </ButtonGroup>
                </div>
            }
            return (
                <div> Loading....</div>
            )
        } else {
            return (<MakerPage/>)
        }
    }

}
