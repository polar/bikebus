import "./FrontPage.css"
import {Component} from "react";
import {RouteOperationEntry} from "./RouteOperationEntry.tsx";
import {Button, ButtonGroup} from "@mui/material";

export interface FrontPageOps {
    prefix: string
    show: string[]
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

    ifShow(name: string) {
        return this.props.show.includes(name)
            ||this.props.show.includes("*")
            ||this.props.show.includes("all")
    }

    render() {
        return (
            <div className="container front-page">
                <div>
                    <img className={"main-image"} src={"/api/planets-align.jpg"} alt={"background"}/>
                </div>
                {this.state.names ? this.getNames() : null}
                <ButtonGroup className={"float-bottom"}>
                    {this.ifShow("draw") && <Button href={`${this.props.prefix}/draw`}>draw</Button> }
                    {this.ifShow("make") && <Button href={`${this.props.prefix}/make`}>make</Button>}
                    {this.ifShow("makes") && <Button href={`${this.props.prefix}/makes`}>Routes</Button>}
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
