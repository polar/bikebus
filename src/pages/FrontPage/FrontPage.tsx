
import {Component} from "react";
import {RouteEntry} from "./RouteEntry.tsx";
import {Button, ButtonGroup} from "@mui/material";

export interface FrontPageOps {
    api: string
    displayNavigation: boolean
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
        const res = await fetch(this.props.api);
        const data = await res.json() as unknown as string[];
        return await this.setAState({names: data});
    }

    componentWillUnmount() {
        clearInterval(this.intervalID)
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
                        <Button href={"/make"}>make</Button>
                        <Button href={"/list"}>list</Button>
                    </ButtonGroup>
                }
                    <ButtonGroup className="float-bottom" >
                        <Button href={"/op"}>OPERATOR</Button>
                    </ButtonGroup>
                </div>
            </div>
        )

    }

    private getNames() {
        return <div className={"overlay"}>
            <h1 className={"name"}>Bike Bus</h1>
            <table>
                <tbody>
                {this.state.names!.map(name => <RouteEntry key={name} name={name}/>)}
                </tbody>
            </table>
        </div>;
    }
}
