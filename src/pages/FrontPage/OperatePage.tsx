import "./FrontPage.css"
import {Component} from "react";
import {RouteOperationEntry} from "./RouteOperationEntry.tsx";

export interface FrontPageOps {
    api: string
}

export interface FrontPageState {
    names?: string[]
}

export default class OperatePage extends Component<FrontPageOps, FrontPageState> {

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
            </div>
        )

    }

    private getNames() {
        return (
            <div className={"overlay"}>
                <h1 className={"name"}>Adiron, LLC</h1>
                <table className={"container"}>
                    <tbody>
                    {this.state.names!.map(name => <RouteOperationEntry key={name} name={name}/>)}
                    </tbody>
                </table>
            </div>
        )
    }
}
