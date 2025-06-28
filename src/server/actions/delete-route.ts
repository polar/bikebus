import {FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest} from "fastify";
import * as path from "node:path";
import fs from "node:fs";
import {RoutesCache} from "../../lib/RoutesCache.ts";
let cache : RoutesCache
let self = this

async function handleRequest(request: FastifyRequest , reply: FastifyReply ) {

    const {name} = request.params as {name?: string}

    let fname = path.join(import.meta.dirname, "../..", "stuff/routes", name + ".json")

    if (fs.existsSync(fname)) {
        try {
            fs.unlinkSync(fname)
            cache.remove(name!)
            return reply.code(200)
                .type("text/plain")
                .send("Route was deleted.")
        } catch (err) {
            return reply.code(403)
                .type("text/plain")
                .send("Route was not deleted.")
        }
    } else {
        cache.remove(name!)
        return reply.code(404)
            .type("text/plain")
            .send("Route was not found.")
    }
}

const plugin : FastifyPluginCallback = (fastify, options: FastifyPluginOptions, next ) => {

    cache = options.cache

    fastify.delete("/route/:name", handleRequest.bind(self))
    next()
}

export default plugin;
