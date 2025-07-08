import {FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest} from "fastify";
import {MakeStore} from "../../lib/MakeStore.ts";

let routeStore : MakeStore
let self = this

async function handleRequest(_request: FastifyRequest, reply: FastifyReply) {

    let makes = routeStore.getMakes()

    let result = makes.map((d: any) => {
        return ({name: d})
    })
    return reply.code(200).type('application/json').send(JSON.stringify(result))
}

const plugin : FastifyPluginCallback = (fastify, options: FastifyPluginOptions, next) => {

    routeStore = options.routeStore

    fastify.get("/makes", handleRequest.bind(self))
    next()
}
export default plugin;
