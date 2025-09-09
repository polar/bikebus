import React from "react";
import {PointEntry} from "./PointEntry.tsx";
import {BusIconChooser} from "./BusIconChooser.tsx";
import {FixedSizeList} from "react-window";

interface PointEditorProps {
    geojson: any;
    onChange?: () => void
}

interface PointEditorState {
    focus: number
}

export class PointEditor extends React.Component<PointEditorProps,PointEditorState> {


    state: PointEditorState =
        {
            focus: 0
        }
    private fs: any[];

    constructor(props: PointEditorProps) {
        super(props);

        this.fs = this.props.geojson.features.filter(
            (f:any) => f.type === "Feature" && f.geometry.type === "Point")
    }

    doUpdate() {
        if (this.props.onChange) {
            this.props.onChange();
        }
    }

    onNameChange(lastIndex: number) {
        this.setState({focus: lastIndex+1 % this.fs.length}, () => {
            if (this.props.onChange) {
                this.props.onChange();
            }
        });

    }
    render() {
        let fs = this.props.geojson.features.filter(
            (f:any) => f.type === "Feature" && f.geometry.type === "Point")
        return (
            <div className={"polar"}>
                <FixedSizeList itemSize={35} height={35*Math.min(15, fs.length)} itemCount={fs.length} width={360}>
                    {
                        ({index, style}) =>
                            <div style={style}>
                                <PointEntry tabIndex={index} feature={fs[index]} key={`point-${index}`} onNameChange={(i) => this.onNameChange(i)} onChange={this.doUpdate.bind(this)}/>
                            </div>
                    }
                </FixedSizeList>
                <BusIconChooser  onChange={this.doUpdate.bind(this)} geojson={this.props.geojson}></BusIconChooser>
            </div>
        )
    }

}


