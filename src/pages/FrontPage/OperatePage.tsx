import "./FrontPage.css"
import {Component} from "react";
import {RouteOperationEntry} from "./RouteOperationEntry.tsx";
import {Button, ButtonGroup} from "@mui/material";

export interface FrontPageOps {
    prefix: string
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
        return fetch('/api/tracker/routes')
            .then(res => res.json() as unknown as string[])
            .then(data =>  this.setAState({names: data}))
    }

    componentWillUnmount() {
        clearInterval(this.intervalID)
    }

    render() {
        return (
            <div className="container front-page">
                <div>
                    <img className={"main-image"} src={"/api/planets-align.jpg"} alt={"background"}/>
                </div>
                {this.state.names ? this.getNames() : null}
                <ButtonGroup>
                    <Button href={`/${this.props.prefix}`}>home</Button>
                    <Button href={`/${this.props.prefix}make`}>make</Button>
                    <Button href={`/${this.props.prefix}list`}>list</Button>
                </ButtonGroup>
            </div>
        )

    }

    private getNames() {
        return (
            <div className={"overlay"}>
                <h1 className={"name"}>Bike Bus</h1>
                <table className={"container"}>
                    <tbody>
                    {this.state.names!.map(name => <RouteOperationEntry prefix={this.props.prefix} key={name} name={name}/>)}
                    </tbody>
                </table>
            </div>
        )
    }
}
