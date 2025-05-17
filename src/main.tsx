import React from "react";
import {TrackerPage} from "./pages/tracker/TrackerPage.tsx";
import {OperatorPage} from "./pages/OperatorPage/OperatorPage.tsx";
import {ensureBusInfoTitle} from "./lib/BusInfo.ts";

interface MainProps {
    name: string;
    operator: boolean
}

interface MainState     {
    loading: boolean,
    geojson?: any
}
export class Main extends React.Component<MainProps, MainState> {
    constructor(props: MainProps) {
        super(props);
        this.state = {
            loading: true
        }
    }

    componentDidMount() {
        fetch(`/api/routes/${this.props.name}.json`)
            .then(response => {
                if (response.ok)
                    return response.json()
                throw response.statusText
            })
            .then(data => {
                    if (data.features) {
                        ensureBusInfoTitle(data)
                        this.setState({geojson: data, loading: false});
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
        if (this.state.geojson) {
            if (this.props.operator) {
                return (<OperatorPage geojson={this.state.geojson}/>)
            } else {
                return (<TrackerPage geojson={this.state.geojson}/>)
            }
        }
        return this.noRoute()
    }
}
