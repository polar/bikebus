import {FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest} from "fastify";
import {DrawStore} from "../../lib/DrawStore.ts";
import {GeoJSONProcessor} from "../../process/GeoJSONProcessor.ts";

let store : DrawStore
let self = this

async function handleRequest(request :FastifyRequest, reply: FastifyReply) {


    let {name} = request.params as {name?: string}

    let draw = store.getDraw(name!)

    let processor = new GeoJSONProcessor(name!, draw)
    let result = processor.raw()

    return reply.code(200).type('application/json').send(JSON.stringify(result))
}

const plugin : FastifyPluginCallback = (fastify, options: FastifyPluginOptions, next) => {

    store = options.drawStore

    fastify.get("/draws/:name", handleRequest.bind(self))
    next()
}

export default plugin;
