import React, {ChangeEvent} from "react";
import {produce} from "immer";
import {
    ButtonGroup,
    createTheme,
    SvgIcon,
    TextField,
    Theme,
    ThemeProvider,
    ToggleButton
} from "@mui/material";

interface PointEditorProps {
    geojson: any;
    onChange?: () => void
}

interface PointEditorState {
    geojson: any;
}

interface PointEntryProps {
    feature: any;
    sequence: number;
    onChange?: () => void;
}

interface PointEntryState {
    feature: any;
}

export class PointEntry extends React.Component<PointEntryProps, PointEntryState> {

    theme: Theme;
    constructor(props: PointEntryProps) {
        super(props);
        this.state = {
            feature: props.feature,
        }
        let themeOptions = {
            palette: {
                mode: 'light',
                primary: {
                    main: "#42a5f5",
                    tonalOffset: 0.5
                },
                background: {
                    default: "#42a5f5"
                }
            },
            typography: {
                fontSize: 10
            },
            components: {
                MuiToggleButton: {
                    styleOverrides: {
                        root: {
                            variants: [{
                                props: (props:any) => {
                                    return props.selected
                                },
                                style: {
                                    background: "rgb(100,0,0,0.2) !important"
                                }
                            }],
                        }
                    }
                }
            }
        };

        // @ts-ignore
        this.theme = createTheme(themeOptions)
    }

    onChangeName(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        if (event.target) {
            let feature = produce(this.state.feature, (f:any) => {f.properties.name = event.target.value})
            this.setState({feature: feature}, () => {
                if (this.props.onChange) {
                    this.props.onChange()
                }
            })
        }
    }

    ignore(event: React.MouseEvent<HTMLElement>): void {
        if (event.target) {
            let feature = produce(this.state.feature, (f:any) => {f.properties.ignore = !f.properties.ignore})
            this.setState({feature:feature}, () => {
                if (this.props.onChange) {
                    this.props.onChange()
                }
            })
        }
    }

    left(event: React.MouseEvent<HTMLElement>): void {
        if (event.target) {
            let feature = produce(this.state.feature, (f:any) => {f.properties.left = !f.properties.left})
            this.setState({feature:feature}, () => {
                if (this.props.onChange) {
                    this.props.onChange()
                }
            })
        }
    }
    rotate65(event: React.MouseEvent<HTMLElement>): void {
        if (event.target) {
            let feature = produce(this.state.feature, (f:any) => {
                if (f.properties.rotate65) {
                    f.properties.rotate65 = false
                    f.properties.rotate35 = false
                } else {
                    f.properties.rotate35 = false
                    f.properties.rotate65 = true
                }
            })
            this.setState({feature:feature}, () => {
                if (this.props.onChange) {
                    this.props.onChange()
                }
            })
        }
    }
    rotate35(event: React.MouseEvent<HTMLElement>): void {
        if (event.target) {
            let feature = produce(this.state.feature, (f:any) => {
                if (f.properties.rotate35) {
                    f.properties.rotate65 = false
                    f.properties.rotate35 = false
                } else {
                    f.properties.rotate65 = false
                    f.properties.rotate35 = true
                }
            })
            this.setState({feature:feature}, () => {
                if (this.props.onChange) {
                    this.props.onChange()
                }
            })
        }
    }

    render() {
        let text = this.state.feature.properties.name || this.state.feature.properties.label.split(",")[0]
        // @ts-ignore
        return (
            <div style={{background : "rgba(230,30,40,0.1)"}}>
                <ThemeProvider theme={this.theme}>
                <ButtonGroup >
                    <TextField size={"small"} value={text} onChange={(e) => this.onChangeName(e)}></TextField>
                    {/* @ts-ignore */}
                    <ToggleButton selected={!this.state.feature.properties.ignore} onChange={this.ignore.bind(this)} size={"small"}>
                        <SvgIcon>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                        </SvgIcon>
                    </ToggleButton>
                    {/* @ts-ignore */}
                    <ToggleButton size={"small"} selected={this.state.feature.properties.left} onChange={this.left.bind(this)}>
                        <SvgIcon>
                            <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><rect fill="none" height="24" width="24"/><path d="M9,19l1.41-1.41L5.83,13H22V11H5.83l4.59-4.59L9,5l-7,7L9,19z"/></svg>
                        </SvgIcon>
                    </ToggleButton>
                    {/* @ts-ignore */}
                    <ToggleButton size={"small"} selected={this.state.feature.properties.rotate65} onChange={this.rotate65.bind(this)}>
                        <SvgIcon>
                            <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><rect fill="none" height="24" width="24"/><path d="M19,9h-2v6.59L5.41,4L4,5.41L15.59,17H9v2h10V9z"/></svg>
                        </SvgIcon>
                    </ToggleButton>
                    {/* @ts-ignore */}
                    <ToggleButton size={"small"} selected={this.state.feature.properties.rotate35} onChange={this.rotate35.bind(this)}>
                        <SvgIcon><svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24" viewBox="0 0 24 24" width="24"><rect fill="none" height="24" width="24"/><path d="M9,5v2h6.59L4,18.59L5.41,20L17,8.41V15h2V5H9z"/></svg>
                        </SvgIcon>
                    </ToggleButton>
                </ButtonGroup>
                </ThemeProvider>
            </div>
        )
    }

    getFeature() {
        return this.state.feature;
    }
}

export class PointEditor extends React.Component<PointEditorProps, PointEditorState> {

    myRefs: React.RefObject<PointEntry>[] = []

    constructor(props: PointEditorProps) {
        super(props);
        this.state = {
            geojson: props.geojson
        }

        let fs = props.geojson.features.filter(
            (f: any) => f.type === "Feature" && f.geometry.type === "Point");
        this.myRefs = fs.map(()   => React.createRef<PointEntry>())
        console.log(`We started with  this many : ${this.myRefs.length}`);
    }

    getData() {
        let route = this.props.geojson.features.find(
            (f:any) => f.type === "Feature" && f.geometry.type === "LineString");
        console.log(`Refs length = ${this.myRefs.length}`);
        let fs = this.myRefs.map((f: any) => f.current.getFeature());
        return {type: "FeatureCollection", features: [route, ...fs]}
    }

    doUpdate() {
        let geojson = this.getData();
        this.setState({geojson: geojson});
        if (this.props.onChange) {
            this.props.onChange();
        }
    }

    render() {
        let self = this
        let fs = this.state.geojson.features.filter(
            (f:any) => f.type === "Feature" && f.geometry.type === "Point")
        return (
            <div className={"polar"}>
                {
                    fs.map((item:any, index: number) =>
                        <PointEntry ref={self.myRefs[index]} feature={item} key={`point-${index}`} sequence={index} onChange={this.doUpdate.bind(this)}/>)
                }
            </div>
        )
    }

}
