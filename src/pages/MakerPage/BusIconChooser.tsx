import React from "react";
import {createTheme, TextField, Theme, ThemeProvider, ToggleButton, ToggleButtonGroup} from "@mui/material";
import {setBusInfoBusIcon} from "../../lib/BusInfo.ts";


interface BusIconChooserProps {
    geojson: any;
    onChange?: () => void;
}

interface BusIconChooserState {
    icons: string[]
    icon: string;
}

export class BusIconChooser extends React.Component<BusIconChooserProps, BusIconChooserState> {

    state = {
        icons: [],
        icon: "/api/bus-icons/44-512.webp"
    }

    theme: Theme

    constructor(props: BusIconChooserProps) {
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
                                    background: "rgb(100,0,0,0.2) !important",
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
    componentDidMount(): void {
        fetch("/api/bus-icons", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
        }).then((res) => res.json())
            .then((data) => {
                this.setState({icons: data.map((item: string) => `/api/bus-icons/${item}`)})
            })
    }
    updateIcon(
        _event: React.MouseEvent<HTMLElement>,
        icon: string | null) {
        if (icon) {
            this.setState({icon: icon}, () => {
                setBusInfoBusIcon(this.props.geojson, icon)
                this.props.onChange && this.props.onChange()
            })
        }
    }

    render() {
        return (
            <div style={{background: "rgba(230,30,40,0.1)"}}>
                <ThemeProvider theme={this.theme}>
                    <ToggleButtonGroup size="small"
                        value={this.state.icon} exclusive={true} onChange={this.updateIcon.bind(this)}>
                        <TextField   disabled size={"medium"}  label={"Bus Icons"}>Bus Icons</TextField>
                        {
                            this.state.icons.map(item =>
                                <ToggleButton size={"small"} value={item}>
                                    <img src={item} width={"30px"}/>
                                </ToggleButton>)
                        }
                    </ToggleButtonGroup>
                </ThemeProvider>
            </div>
        )
    }
}
