import React from "react";

interface LocationControlProps {
    state: string;
    onClick: () => void;
}

export class LocationControl extends React.Component<LocationControlProps, {}> {

    render() {
        let icon = "/api/Maps-Center-Direction-icon.png"
        return (
            <button
                className={"leaflet-control location-control " + this.props.state}>
                <img src={icon} alt={"center"} height={"20px"} onClick={_ => this.props.onClick()}/>
            </button>
        )
    }
}
