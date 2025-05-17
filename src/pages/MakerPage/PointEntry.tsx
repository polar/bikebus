import React, {ChangeEvent} from "react";
import {ButtonGroup, createTheme, SvgIcon, TextField, Theme, ThemeProvider, ToggleButton} from "@mui/material";

interface PointEntryProps {
    feature: any;
    onChange?: () => void;
}

export class PointEntry extends React.Component<PointEntryProps, { update: number }> {

    theme: Theme;
    state = {
        update: 0
    }

    constructor(props: PointEntryProps) {
        super(props);
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
                                props: (props: any) => {
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
            this.props.feature.properties.title = event.target.value;
            this.setState({update: this.state.update + 1}, () => this.props.onChange && this.props.onChange())
        }
    }

    ignore(event: React.MouseEvent<HTMLElement>): void {
        if (event.target) {
            this.props.feature.properties.ignore = !this.props.feature.properties.ignore
            this.setState({update: this.state.update + 1}, () => this.props.onChange && this.props.onChange())
        }
    }

    left(event: React.MouseEvent<HTMLElement>): void {
        if (event.target) {
            this.props.feature.properties.left = !this.props.feature.properties.left;
            this.setState({update: this.state.update + 1}, () => this.props.onChange && this.props.onChange())
        }
    }

    rotate65(event: React.MouseEvent<HTMLElement>): void {
        if (event.target) {
            let f = this.props.feature
            if (f.properties.rotate65) {
                f.properties.rotate65 = false
                f.properties.rotate35 = false
            } else {
                f.properties.rotate35 = false
                f.properties.rotate65 = true
            }
            this.setState({update: this.state.update + 1}, () => this.props.onChange && this.props.onChange())
        }
    }

    rotate35(event: React.MouseEvent<HTMLElement>): void {
        if (event.target) {
            let f = this.props.feature
            if (f.properties.rotate35) {
                f.properties.rotate65 = false
                f.properties.rotate35 = false
            } else {
                f.properties.rotate65 = false
                f.properties.rotate35 = true
            }
            this.setState({update: this.state.update + 1}, () => this.props.onChange && this.props.onChange())
        }
    }

    render() {
        let text = this.props.feature.properties.name || this.props.feature.properties.label.split(",")[0]
        // @ts-ignore
        return (
            <div style={{background: "rgba(230,30,40,0.1)"}}>
                <ThemeProvider theme={this.theme}>
                    <ButtonGroup>
                        <TextField size={"small"} value={text} onChange={(e) => this.onChangeName(e)}></TextField>
                        {/* @ts-ignore */}
                        <ToggleButton selected={!this.props.feature.properties.ignore} onChange={this.ignore.bind(this)}
                                      size={"small"}>
                            <SvgIcon>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                                    <path d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                </svg>
                            </SvgIcon>
                        </ToggleButton>
                        {/* @ts-ignore */}
                        <ToggleButton size={"small"} selected={this.props.feature.properties.left}
                                      onChange={this.left.bind(this)}>
                            <SvgIcon>
                                <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24"
                                     viewBox="0 0 24 24" width="24">
                                    <rect fill="none" height="24" width="24"/>
                                    <path d="M9,19l1.41-1.41L5.83,13H22V11H5.83l4.59-4.59L9,5l-7,7L9,19z"/>
                                </svg>
                            </SvgIcon>
                        </ToggleButton>
                        {/* @ts-ignore */}
                        <ToggleButton size={"small"} selected={this.props.feature.properties.rotate65}
                                      onChange={this.rotate65.bind(this)}>
                            <SvgIcon>
                                <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24"
                                     viewBox="0 0 24 24" width="24">
                                    <rect fill="none" height="24" width="24"/>
                                    <path d="M19,9h-2v6.59L5.41,4L4,5.41L15.59,17H9v2h10V9z"/>
                                </svg>
                            </SvgIcon>
                        </ToggleButton>
                        {/* @ts-ignore */}
                        <ToggleButton size={"small"} selected={this.props.feature.properties.rotate35}
                                      onChange={this.rotate35.bind(this)}>
                            <SvgIcon>
                                <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24"
                                     viewBox="0 0 24 24" width="24">
                                    <rect fill="none" height="24" width="24"/>
                                    <path d="M9,5v2h6.59L4,18.59L5.41,20L17,8.41V15h2V5H9z"/>
                                </svg>
                            </SvgIcon>
                        </ToggleButton>
                    </ButtonGroup>
                </ThemeProvider>
            </div>
        )
    }
}
