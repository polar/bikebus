import {FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest} from "fastify";
import {DrawStore} from "../../lib/DrawStore.ts";
var store : DrawStore
let self = this

async function handleRequest(request:FastifyRequest, reply:FastifyReply) {

    const {name} = request.params as {name?: string}
    if (!store.has(name)) {
        return reply
            .code(404)
            .type('text/plain')
            .send('Draw not found.')
    }

    let draw = store.getDraw(name!)
    if (!draw) {
        return reply.code(404)
            .type('text/plain')
            .send('Draw not found')
    }
    return reply.code(200).type('application/json').send(JSON.stringify(draw))
}
const plugin : FastifyPluginCallback = (fastify, options : FastifyPluginOptions, next) => {


    store = options.drawStore

    fastify.get("/draw/:name", handleRequest.bind(self))
    next()
}

export default plugin;
