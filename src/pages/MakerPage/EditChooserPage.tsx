import React from "react";
import {Button, ButtonGroup, ListItemButton} from "@mui/material";

interface EditChooserPageState {
    routes: string[]
}
const PAGE_UPDATE_SECONDS = 10

export class EditChooserPage extends React.Component<{},EditChooserPageState> {

    state =  {
        routes: []
    }

    intervalID : any

    componentDidMount() {
        this.updatePage()
            .then(() => {
                this.intervalID = setInterval(
                    () => this.updatePage(),
                    1000*PAGE_UPDATE_SECONDS)
                })
    }

    setAState(newState: EditChooserPageState) {
        return new Promise( (resolve, _reject) =>
            {
                this.setState(newState, () => resolve(undefined));
            });
    }

    async updatePage() {
        const result = await fetch("/api/tracker/routes");
        const data = await result.json();
        return await this.setAState({routes: data});
    }

    componentWillUnmount() {
        clearInterval(this.intervalID)
    }

    render() {
        if (this.state.routes) {
            return (
                <div>
                    <h1>Edit Route</h1>
                    <ButtonGroup size={"small"} orientation={"vertical"}>
                        {
                            this.state.routes.map(
                                (route: string) =>
                                    <ListItemButton dense={true} href={`/make/${route}`}>{route}</ListItemButton>

                            )
                        }
                    </ButtonGroup>
                    <h1>New</h1>
                    <ButtonGroup size={"small"} orientation={"vertical"}>
                        <Button href={"/make"}>Make New</Button>
                    </ButtonGroup>
                </div>
            )
        }
        return (<div>Loading....</div>)
    }
}
