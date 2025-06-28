import {FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest} from "fastify";
import {getBusInfoLineString} from "../../lib/BusInfo.ts";
import {DrawStore} from "../../lib/DrawStore.ts";


let store : DrawStore
let self = this

async function handleRequest(request : FastifyRequest , reply: FastifyReply ) {

    const {name} = request.params as {name?: string}
    if (!store.has(name)) {
        return reply
            .code(404)
            .type('text/plain')
            .send('Route not found.');
    }
    var geojson = store.getDraw(name!)
    if (geojson) {
        let ls = getBusInfoLineString(geojson)
        if (ls) {
            // update the timestamp if we are more than 1 second from the last timestamp.
            let timestamp = new Date().getTime()
            let lastTimeStamp = ls.properties.timestamps[ls.properties.timestamps.length - 1]
            if (lastTimeStamp == undefined || timestamp - lastTimeStamp > 1000) {
                var last = ls.geometry.coordinates[ls.geometry.coordinates.length - 1]
                if (last) {
                    var location = {
                        timestamp: timestamp,
                        latitude: last[1],
                        longitude: last[0],
                    }
                    store.addLocation(name!, location)
                }
            }
            if (geojson.features.length === 1) {
                store.addFeature(
                    name!,
                    {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: ls.coordinates[0]
                        },
                        properties: {
                            title: "Start",
                            timestamps: [timestamp]
                        }
                    }
                )
                store.addFeature(
                    name!,
                    {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: ls.coordinates[ls.coordinates.length - 1]
                        },
                        properties: {
                            title: "End",
                            timestamps: [timestamp]
                        }
                    }
                )
            }
        }
    }

    return reply.code(200)
        .type("application/json")
        .send()
}


const plugin : FastifyPluginCallback = (fastify, options : FastifyPluginOptions, next ) => {
    store = options.drawStore

    fastify.delete("/draw/:name/location", handleRequest.bind(self))
    next()
}

export default plugin;
