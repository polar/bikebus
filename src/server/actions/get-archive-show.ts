import {FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest} from "fastify";
import {GeoJSONProcessor} from "../../process/GeoJSONProcessor.ts";
import {MakeStore} from "../../lib/MakeStore.ts";

let store : MakeStore
let self = this

async function handleRequest(request :FastifyRequest, reply: FastifyReply) {


    let {name} = request.params as {name?: string}

    let draw = store.getMake(name!)

    let processor = new GeoJSONProcessor(name!, draw)
    let result = processor.raw()

    return reply.code(200).type('application/json').send(JSON.stringify(result))
}

const plugin : FastifyPluginCallback = (fastify, options: FastifyPluginOptions, next) => {

    store = options.archiveStore

    fastify.get("/archive/:name", handleRequest.bind(self))
    next()
}

export default plugin;
