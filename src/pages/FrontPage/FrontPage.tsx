import "./FrontPage.css"
import {Component} from "react";
import {RouteEntry} from "./RouteEntry.tsx";
import {Button} from "@mui/material";

export interface FrontPageOps {
    api: string
}

export interface FrontPageState {
    names?: string[]
}

export default class FrontPage extends Component<FrontPageOps, FrontPageState> {

    state: FrontPageState = {}

    componentDidMount() {
        let self = this
        fetch(this.props.api)
            .then(res => res.json() as unknown as string[])
            .then(data => self.setState({names: data}))
    }

    render() {
        return (
            <div className="container">
                <div>
                    <img src={"/api/planets-align.jpg"} alt={"background"}/>
                </div>
                {this.state.names ? this.getNames() : null}
                <Button href={"/op"}>op</Button>
                <Button href={"/make"}>make</Button>
            </div>
        )

    }

    private getNames() {
        return <div className={"overlay"}>
            <h1 className={"name"}>Adiron, LLC</h1>
            <table>
                <tbody>
                {this.state.names!.map(name => <RouteEntry key={name} name={name}/>)}
                </tbody>
            </table>
        </div>;
    }
}
