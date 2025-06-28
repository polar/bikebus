import {FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest} from "fastify";
import {RoutesCache} from "../../lib/RoutesCache.ts";

let cache : RoutesCache
let self = this

async function handleRequest(request : FastifyRequest , reply : FastifyReply) {

    const {route} = request.params as {route?: string}
    if (!cache.has(route)) {
        return reply
            .code(404)
            .type('text/plain')
            .send('Route not found.');
    }

    cache.removeLocation(route!)

    return reply.code(200)
        .type("application/json")
        .send()
}

const plugin : FastifyPluginCallback = (fastify, options : FastifyPluginOptions, next ) : void => {
    cache = options.cache

    fastify.delete("/tracker/:route/location", handleRequest.bind(self))
    next()
}

export default plugin;
