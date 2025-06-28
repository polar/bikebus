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

    const {type, user} = request.query as {type?: string, user?: string}

    let userName = user
    // @ts-ignore
    if (!user && request.session && request.session.user) {
        // @ts-ignore
        userName = request.session.user
    } else {
        userName = idGenerator()
        // @ts-ignore
        request.session.user = userName
    }

    return reply.code(200).type('application/json').send({type: type, user: userName, route: route})
}
const plugin: FastifyPluginCallback = (fastify, options: FastifyPluginOptions, next) => {


    cache = options.cache
    idGenerator = options.idGenerator

    fastify.get("/tracker/:route/hello", handleRequest.bind(self))
    next()
}
export default plugin;
