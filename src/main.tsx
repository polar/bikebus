import React, {StrictMode} from "react";
import {hydrateRoot} from "react-dom/client";
import {TrackerPage} from "./pages/tracker/tracker-page.tsx";
import {BusInfo} from "./BusInfo";

interface MainProps {
    name: string
}
interface MainState {
    busInfo: BusInfo | null
}

export class Main extends React.Component<MainProps,MainState> {
    constructor(props: MainProps) {
        super(props);
        this.state = { name: props.name, busInfo: null}
    }

    state = {
        name: this.props.name,
        busInfo: null
    }

    componentDidMount() {
        fetch("/api/NewRoute.json")
            .then(response => response.json())
            .then(data => {
                this.setState({busInfo: data[this.state.name]})
                console.log(data)
            }).catch((error: any) => console.error(error))
    }

    render() {
        return (
            <>
                {
                    (this.state.busInfo != null) ? <TrackerPage busInfo={this.state.busInfo}/> : <div>Loading...</div>
                }
            </>
        )
    }
}

hydrateRoot(
    document.getElementById('app')!,
        <Main name={"nottingham"}/>
)
