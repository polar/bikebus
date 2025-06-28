import {FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest} from "fastify";
import {RoutesCache} from "../../lib/RoutesCache.ts";

let self = this
let cache : RoutesCache

async function handleRequest(_request: FastifyRequest, reply: FastifyReply) {
    let names = cache.getRoutes()
    return reply.code(200).type('application/json').send(JSON.stringify(names))
}

const plugin : FastifyPluginCallback = (fastify, options: FastifyPluginOptions, next) => {

    cache = options.cache

    fastify.get("/tracker/routes", handleRequest.bind(self))
    next()
}

export default plugin;
