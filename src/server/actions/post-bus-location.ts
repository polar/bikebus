import {FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest} from "fastify";
import {RoutesCache} from "../../lib/RoutesCache.ts";

let cache : RoutesCache
let self = this

async function handleRequest(request: FastifyRequest , reply: FastifyReply ) {

    const {route, user} = request.params as {route?: string, user?: string}
    if (!cache.has(route)) {
        return reply
            .code(404)
            .type('text/plain')
            .send('Route not found.');
    }

    let location = {
        //@ts-ignore
        timestamp: request.body.timestamp,
        //@ts-ignore
        latitude: request.body.latitude,
        //@ts-ignore
        longitude: request.body.longitude,
    }
    cache.setLocation(route!, location)


    //@ts-ignore
    let ans = {location: location, requestUser: user, sessionUser: request.session.user}

    return reply.code(200)
        .type("application/json")
        .send(JSON.stringify(ans))
}

const plugin : FastifyPluginCallback = (fastify, options: FastifyPluginOptions, next ) => {
    cache = options.cache

    fastify.post("/tracker/:route/location", handleRequest.bind(self))
    next()
}
export default plugin;
