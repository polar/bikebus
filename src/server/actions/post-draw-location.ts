import {FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest} from "fastify";
import {DrawStore} from "../../lib/DrawStore.ts";

let store : DrawStore
let self = this

async function handleRequest(request: FastifyRequest , reply: FastifyReply ) {

    const {name} = request.params as {name?: string}
    if (!store.has(name)) {
        return reply
            .code(404)
            .type('text/plain')
            .send('Archive not found.');
    }

    let location = {
        // @ts-ignore
        timestamp: request.body.timestamp,
        // @ts-ignore
        latitude: request.body.latitude,
        // @ts-ignore
        longitude: request.body.longitude,
    }
    store.addLocation(name!, location)


    // @ts-ignore
    let ans = {location: location, draw: name, sessionName: request.session.name}

    return reply.code(200)
        .type("application/json")
        .send(JSON.stringify(ans))
}

const plugin : FastifyPluginCallback = (fastify, options:FastifyPluginOptions, next ) => {


    store = options.drawStore
    fastify.post("/draw/:name/location", handleRequest.bind(self))
    next()
}

export default plugin;
