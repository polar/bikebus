
import fs from "node:fs";

const waitFor = (delay: number) => new Promise(resolve => setTimeout(resolve, Math.ceil(delay)));

/**
 * Replays a geojson file to the server. If the geojson file does not have a timestamps property,
 * the difference between published coordinates is 3 seconds times the scale.
 * @param file The geojson file to replay.
 * @param scale The speed of the replay. 1 is normal speed, 2 is twice as fast, 0.5 is half as fast.
 * @param toRoute The route to replay to. If not specified, the first route in the geojson file is used.
 */
export async function replay(file: string, scale: number = 1, toRoute?: string): Promise<void> {
    let lasttimestamp : number | undefined;
    let cookie : string | null | undefined;

    let geojson = JSON.parse(fs.readFileSync(file, "utf8"));

    let route = toRoute || geojson.features[0].properties.title;

    let timestamps = geojson.features[0].properties.timestamps || [];

    let response = await fetch(`http://localhost:9090/tracker/${route}/hello?type=operator`, {
        method: "GET",
        headers: {
            "content-type": "application/json",
            "accept": "application/json"
        }
    })
    cookie = response.headers.get("set-cookie");

    let coordinates = geojson.features[0].geometry.coordinates;
    for (const coordinate of coordinates) {
        const index = coordinates.indexOf(coordinate);
        let timestamp = timestamps[index] || (lasttimestamp || (new Date()).getTime()) + 3000;

        let diff = timestamp - (lasttimestamp ? lasttimestamp : timestamp - 1);
        if (diff > 0) {
            await waitFor(diff * scale)
            let response: Response = await fetch(`http://localhost:9090/tracker/${route}/location`, {
                method: "POST",
                headers: {
                    "content-type": "application/json",
                    "accept": "application/json",
                    ...(cookie ? {"cookie": cookie} : {})
                },
                body: JSON.stringify({
                    timestamp: timestamps[index],
                    longitude: coordinate[0],
                    latitude: coordinate[1]
                })
            })
            cookie = response.headers.get("set-cookie");
        }
        lasttimestamp = timestamp
    }

    await fetch(`http://localhost:9090/tracker/${route}/location`, {
        method: "DELETE",
        headers: { "content-type": "application/json", "accept": "application/json" },
        body: JSON.stringify({})
    })
}
