import {FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest} from "fastify";
import {MakeStore} from "../../lib/MakeStore.ts";

let archiveStore : MakeStore
let self = this

async function handleRequest(_request: FastifyRequest, reply: FastifyReply) {

    let makes = archiveStore.getMakes()

    let result = makes.map((d: any) => {
        return ({name: d})
    })
    return reply.code(200).type('application/json').send(JSON.stringify(result))
}

const plugin : FastifyPluginCallback = (fastify, options: FastifyPluginOptions, next) => {

    archiveStore = options.archiveStore

    fastify.get("/archive", handleRequest.bind(self))
    next()
}
export default plugin;
