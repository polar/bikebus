import {BusInfo} from "../../BusInfo.ts";
// @ts-ignore
import React from "react";

export function TrackerHead(props: { busInfo: BusInfo, }) {
    return (
        <>
            <meta charSet="utf-8"/>
            <link rel="icon" href="https://glitch.com/favicon.ico"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>

            <meta property="og:updated_time" content="1686368955"/>
            <meta property="og:title" content="{{title}}"/>
                        <meta property="og:type" content="website"/>

            <title>{props.busInfo.title} Bike Bus Tracker</title>

        </>
    )
}
