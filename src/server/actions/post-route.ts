import {FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest} from "fastify";
import {RoutesCache} from "../../lib/RoutesCache.ts";
import {ensureBusInfoTitle, getBusInfoTitle} from "../../lib/BusInfo.ts";
import * as path from "node:path";
import fs from "node:fs";

let cache : RoutesCache
let self = this

async function handleRequest(request: FastifyRequest , reply: FastifyReply ) {

    let json = request.body
    // @ts-ignore
    if (json && json.features) {
        ensureBusInfoTitle(json)
        let name = getBusInfoTitle(json)
        if (name) {
            console.log(name, "WTF")
            // Fastify has a built-in 1M limit on the body of the request.
            // So, we just limit the number of draws we will store. Use the cache.
            if (cache.atLimit() && !cache.has(name)) {
                return reply.code(452).type("text/plain").send("Too many draws on the server")
            }
            //                      actions / server / src /
            let fname = path.join(import.meta.dirname, "../..", "stuff/routes", name + ".json")

            if (fs.existsSync(fname)) {
                return reply.code(409).type('text/plain').send('Route Will be overwritten.');
            } else {
                fs.writeFileSync(fname, JSON.stringify(json, null, 2), 'utf8');
                cache.add(name)
                return reply.code(200).type("application/json").send(json)
            }
        } else {
            return reply.code(400).type("text/plain").send('Route requires a non empty name.')
        }
    }
    return reply.code(400)
        .type("text/plain")
        .send("Invalid GeoJSON")
}

const plugin : FastifyPluginCallback = (fastify, options: FastifyPluginOptions, next ) => {
    cache = options.cache
    fastify.post("/route", handleRequest.bind(self))
    next()
}
export default plugin;
