import React from "react";

interface CenterControlProps {
    icon: string;
    on: boolean;
    onClick: () => void;
}

export class CenterControl extends React.Component<CenterControlProps, {}> {

    render() {
        return (
            <button
                className={"leaflet-control " + (this.props.on ? "center-button-on" : "center-button")}>
                <img src={this.props.icon} alt={"center"} height={"20px"} onClick={_ => this.props.onClick()}/>
            </button>
        )
    }
}
