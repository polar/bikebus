import React from "react";
import {TrackerPage} from "./pages/tracker/TrackerPage.tsx";
import {BusInfo} from "./lib/BusInfo.ts";
import {OperatorPage} from "./pages/OperatorPage/OperatorPage.tsx";

interface MainProps {
    name: string;
    operator: boolean
}

interface MainState     {
    loading: boolean
    busInfo?: BusInfo
}
export class Main extends React.Component<MainProps, MainState> {
    constructor(props: MainProps) {
        super(props);
        this.state = {
            busInfo: undefined,
            loading: true
        }
    }

    componentDidMount() {
        fetch(`/api/routes/${this.props.name}.json`)
            .then(response => response.json())
            .then(data => {
                if (data[this.props.name]) {
                    this.setState({busInfo: data[this.props.name], loading: false});
                } else {
                    if (data.features) {
                        let ls = data.features.find((f:any) => f.type === "Feature" && f.geometry.type === "LineString")
                        if (ls && ls.properties.title) {
                            let name = ls.properties.title.replaceAll(" ", "_")
                            let bi = {name: name, title: ls.properties.title, geojson: data}
                            // @ts-ignore
                            this.setState({busInfo: bi, loading: false});
                        }
                    }
                }
            }).catch((error: any) => {
            console.error(error)
            this.setState({loading: false})
        })
    }

    noRoute() {
        return (
            <div>
            Your route named by {this.props.name} was not found in our database.
            </div>
        )
    }

    loading() {
        return (
            <div>
                Loading....
            </div>
        )
    }

    render() {
        if (this.state.loading) {
            return this.loading()
        }
        if (this.state.busInfo) {
            if (this.props.operator) {
                return (<OperatorPage busInfo={this.state.busInfo}/>)
            } else {
                return (<TrackerPage busInfo={this.state.busInfo}/>)
            }
        }
        return this.noRoute()
    }
}
