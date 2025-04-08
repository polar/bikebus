
import React from "react"
import fs from "fs"
import path from "node:path";

const css = fs.readFileSync(path.resolve(__dirname, "./index.css"), "utf8")

export function Index() {
    return (
        <>
        <head>

            <meta charSet="utf-8"/>
            <link rel="icon" href="https://glitch.com/favicon.ico"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>

            <meta property="og:updated_time" content="1682473384"/>
            <meta property="og:title" content="CBGN Bike Bus Tracker"/>
            <meta property="og:description"
                  content="Track all three routes live on this page on every Wednesday beginning at 7:30am."/>
            <meta property="og:type" content="website"/>

            <title>Bike Bus Tracker</title>
            <style>{css}</style>
        </head>
        <body>

        <h1>Meadobrook Bike Bus Tracker</h1>
        <a className="bus-link-txt north-halsted" href="/nottingham">

            <h2>
                Track the Meadowbrook Bike Bus<br />
            </h2>
        </a>

        <a className="bus-link-txt" href="/beacon/nottingham/">
            Be the Beacon!
        </a>

        <h3>
            Brought to you by
            <a href="https://adiron.com">Dr. Polar Humenn</a>
        </h3>

        </body>
            </>
    )
}
