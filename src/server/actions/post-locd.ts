// noinspection SpellCheckingInspection

import {FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest} from "fastify";
import {RoutesCache} from "../../lib/RoutesCache.ts";

let cache : RoutesCache
let self = this

async function handleRequest(request: FastifyRequest , reply: FastifyReply ) {

    const {route} = request.params as {route?: string}
    if (!cache.has(route)) {
        return reply
            .code(404)
            .type('text/plain')
            .send('Route not found.');
    }

    let location = {
        // @ts-ignore
        timestamp: request.body.timestamp,
        // @ts-ignore
        latitude: request.body.latitude,
        // @ts-ignore
        longitude: request.body.longitude,
        // @ts-ignore
        heading: request.body.heading,
        // @ts-ignore
        bearing: request.body.bearing,
    }

    return reply.code(200)
        .type("application/json")
        .send(JSON.stringify(location))
}

const plugin : FastifyPluginCallback = (fastify, options : FastifyPluginOptions, next ) => {

    cache = options.cache

    fastify.post("/tracker/:route/locd", handleRequest.bind(self))
    next()
}

export default plugin;
