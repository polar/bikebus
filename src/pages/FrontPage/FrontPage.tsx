
import {Component} from "react";
import {RouteEntry} from "./RouteEntry.tsx";
import {Button, ButtonGroup} from "@mui/material";

export interface FrontPageOps {
    prefix: string
    displayNavigation: boolean
    displayOperator: boolean
}

export interface FrontPageState {
    names?: string[]
}

const PAGE_UPDATE_SECONDS = 10

export default class FrontPage extends Component<FrontPageOps, FrontPageState> {

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
            .then(() => {
                this.intervalID = setInterval(
                    ()=>  this.updatePage(),
                    1000*PAGE_UPDATE_SECONDS)
            })
    }

    private async updatePage() {
        const res = await fetch(`/api/tracker/routes`);
        const data = await res.json() as unknown as string[];
        return await this.setAState({names: data});
    }

    componentWillUnmount() {
        clearInterval(this.intervalID)
    }

    onClick() {
        fetch("/api/draw/hello")
            .then(res => res.json())
            .then(data => {
                window.location.href = `${this.props.prefix}/draw/${data.name}/op`
        })
    }

    render() {
        return (
            <div className="container front-page">
                <div>
                <div>
                    <img className={"main-image"} src={"/api/planets-align.jpg"} alt={"background"}/>
                </div>
                {this.state.names ? this.getNames() : null}
                {
                    this.props.displayNavigation &&
                    <ButtonGroup className={"float-bottom"}>
                        <Button href={`${this.props.prefix}/make`}>Make</Button>
                        <Button href={`${this.props.prefix}/makes`}>Makes</Button>
                        <Button href={`${this.props.prefix}/draws`}>Draws</Button>
                    </ButtonGroup>
                }
                {
                    this.props.displayOperator &&
                    <ButtonGroup className="float-bottom" >
                        <Button href={`${this.props.prefix}/operator`}>OPERATOR</Button>
                        <Button onClick={() => this.onClick()}>DRAW</Button>
                    </ButtonGroup>
                }
                </div>
            </div>
        )

    }

    private getNames() {
        return <div className={"overlay"}>
            <h1 className={"name"}>Bike Bus</h1>
            <table>
                <tbody>
                {this.state.names!.map(name => <RouteEntry prefix={this.props.prefix} key={name} name={name}/>)}
                </tbody>
            </table>
        </div>;
    }
}
