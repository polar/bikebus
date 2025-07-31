import {FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest} from "fastify";
import {RoutesCache} from "../../lib/RoutesCache.ts";

let cache : RoutesCache
let idGenerator : () => string
let self = this

async function handleRequest(request: FastifyRequest, reply: FastifyReply) {

    const {route} = request.params as {route?: string}
    if (!cache.has(route)) {
        return reply
            .code(404)
            .type('text/plain')
            .send('Route not found.')
    }

    const {type, name} = request.query as {type?: string, name?: string}

    let hello = name
    // @ts-ignore
    if (!name && request.session && request.session.hello) {
        // @ts-ignore
        hello = request.session.hello
    } else {
        hello = idGenerator()
        // @ts-ignore
        request.session.hello = hello
    }

    return reply.code(200).type('application/json').send({type: type, hello: hello, route: route})
}
const plugin: FastifyPluginCallback = (fastify, options: FastifyPluginOptions, next) => {


    cache = options.cache
    idGenerator = options.idGenerator

    fastify.get("/tracker/:route/hello", handleRequest.bind(self))
    next()
}
export default plugin;
