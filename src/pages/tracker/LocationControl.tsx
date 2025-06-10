import React from "react";

interface LocationControlProps {
    icon: string;
    state: string;
    onClick: () => void;
}

export class LocationControl extends React.Component<LocationControlProps, {}> {

    render() {
        return (
            <button
                className={"leaflet-control location-control " + this.props.state}>
                <img src={this.props.icon} alt={"center"} height={"20px"} onClick={_ => this.props.onClick()}/>
            </button>
        )
    }
}
