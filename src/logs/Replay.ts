
import {FileHandle, open} from "node:fs/promises"

const waitFor = (delay: number) => new Promise(resolve => setTimeout(resolve, delay));


async function replay(file: string, route: string): Promise<void> {
    let lasttimestamp;

    const handler : FileHandle = await open(file);
    for await (const line of handler.readLines()) {
        try {
            let data = JSON.parse(line!)
            if (data.hasOwnProperty("res")) {
                if (data.res.statusCode == "200" && data.res.method === "POST" && data.res.url.includes(route)) {
                    let timestamp = data.res!.payload.timestamp;
                    let diff = timestamp - (lasttimestamp ? lasttimestamp : timestamp - 1);
                    if (diff > 0) {
                        await waitFor(diff/50)
                        await fetch(`http://localhost:9090/tracker/${route}/location`, {
                            method: "POST",
                            headers: { "content-type": "application/json", "accept": "application/json" },
                            body: JSON.stringify(data.res.payload)
                        })
                        lasttimestamp = timestamp
                    }
                }
            }
        } catch (error) {
            console.error(error)
        }
    }
    await fetch(`http://localhost:9090/tracker/${route}/location`, {
        method: "DELETE",
        headers: { "content-type": "application/json", "accept": "application/json" },
        body: JSON.stringify({})
    })
}

replay("./src/logs/log.json.1", "Bike_Party")
.then(() => {
    console.log("Done")
})
