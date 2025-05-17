import React, {ChangeEvent} from "react";
import {TextField} from "@mui/material";
import {PointEditor} from "./PointEditor.tsx";
import {MapElement} from "../tracker/MapElement.tsx";

interface EditorElementProps {
    geojson: any;
    onChange?: () => void;
    editTitleEnabled: boolean
}

interface EditorElementState {
    disableUrl: boolean
    update: number
}

export class EditorElement extends React.Component<EditorElementProps, EditorElementState> {

    state = {
        disableUrl: false,
        update: 0
    }

    myUpdate() {
        this.setState({update: this.state.update + 1});
        if (this.props.onChange) {
            this.props.onChange()
        }
    }

    changeTitle(_event: ChangeEvent<HTMLInputElement>) {
        if (_event.target) {
            let f = this.props.geojson.features.find((f: any) => f.type === "Feature" && f.geometry.type === "LineString")
            if (f) {
                f.properties.title = _event.target.value;
                if (this.props.onChange) {
                    this.props.onChange()
                }
            }
        }
    }

    render() {
        if (this.props.geojson) {
            let title = ""
            let geojson = this.props.geojson
            if (geojson) {
                let ls = geojson.features.find((f: any) => f.type === "Feature" && f.geometry.type === "LineString")
                if (ls) {
                    if (ls.properties.title) {
                        title = ls.properties.title
                    }
                }
                return (
                    <div className={"container"}>
                        <div className={"polar center"}>
                            <div className={"map-title"}>
                                <TextField value={title} color={title ? "primary" : "warning"}
                                           disabled={!this.props.editTitleEnabled}
                                           onChange={this.changeTitle.bind(this)}></TextField>
                            </div>
                        </div>
                        <PointEditor geojson={geojson} onChange={this.myUpdate.bind(this)}/>
                        <MapElement geojson={geojson} editor={true} enableTracker={false}/>
                    </div>
                )
            }
        }
    }
}
