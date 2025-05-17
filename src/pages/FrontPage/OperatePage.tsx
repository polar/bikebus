import "./FrontPage.css"
import {Component} from "react";
import {RouteOperationEntry} from "./RouteOperationEntry.tsx";
import {Button} from "@mui/material";

export interface FrontPageOps {
    api: string
}

export interface FrontPageState {
    names?: string[]
}

const PAGE_UPDATE_SECONDS = 10

export default class OperatePage extends Component<FrontPageOps, FrontPageState> {

    state: FrontPageState = {}

    intervalID: any;

    setAState(newState: FrontPageState) {
        return new Promise( (resolve, _reject) =>
        {
            this.setState(newState, () => resolve(undefined));
        });
    }

    componentDidMount() {
        this.updatePage()
            .then( () => {
                this.intervalID = setInterval(
                    ()=> this.updatePage(),
                    1000*PAGE_UPDATE_SECONDS)

            })
    }

    private updatePage() {
        return fetch(this.props.api)
            .then(res => res.json() as unknown as string[])
            .then(data =>  this.setAState({names: data}))
    }

    componentWillUnmount() {
        clearInterval(this.intervalID)
    }

    render() {
        return (
            <div className="container">
                <div>
                    <img src={"/api/planets-align.jpg"} alt={"background"}/>
                </div>
                {this.state.names ? this.getNames() : null}
                <Button href={"/"}>home</Button>
                <Button href={"/make"}>make</Button>
                <Button href={"/list"}>list</Button>
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
