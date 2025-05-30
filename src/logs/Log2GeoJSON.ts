
import fs from "node:fs"

import {FileHandle, open} from "node:fs/promises"


async function readJSONLines(file: string, route: string): Promise<number[][]> {
    let coordinates: number[][] = []

    const handler : FileHandle = await open(file);
    for await (const line of handler.readLines()) {
        try {
            let data = JSON.parse(line!)
            if (data.hasOwnProperty("res")) {
                if (data.res.statusCode == "200" && data.res.method === "POST" && data.res.url.includes(route)) {
                    coordinates.push([data.res.payload.longitude, data.res.payload.latitude])
                }
            }
        } catch (error) {
            console.error(error)
        }
    }
    return coordinates;
}

readJSONLines("logs/log.json.1", "Bike_Party")
    .then(coordinates => {
        return (
            {
                type: "FeatureCollection",
                features: [
                    {
                        type: "Feature",
                        properties: {
                            title: "Test"
                        },
                        geometry: {
                            type: "LineString",
                            coordinates: coordinates
                        }
                    }
                ]
            }
        )
    })
    .then(geojson => {
        fs.writeFileSync("logs/geojson.json", JSON.stringify(geojson, null, 2))
    })

