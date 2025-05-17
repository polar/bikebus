import React from "react";
import {PointEntry} from "./PointEntry.tsx";
import {BusIconChooser} from "./BusIconChooser.tsx";

interface PointEditorProps {
    geojson: any;
    onChange?: () => void
}


export class PointEditor extends React.Component<PointEditorProps, {}> {


    constructor(props: PointEditorProps) {
        super(props);
    }

    doUpdate() {
        if (this.props.onChange) {
            this.props.onChange();
        }
    }

    render() {
        let fs = this.props.geojson.features.filter(
            (f:any) => f.type === "Feature" && f.geometry.type === "Point")
        return (
            <div className={"polar"}>
                {
                    fs.map((item:any, index: number) =>
                        <PointEntry feature={item} key={`point-${index}`} onChange={this.doUpdate.bind(this)}/>)
                }
                <BusIconChooser  onChange={this.doUpdate.bind(this)} geojson={this.props.geojson}></BusIconChooser>
            </div>
        )
    }

}


