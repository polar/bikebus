import {GeoJSONProcessor} from "../../process/GeoJSONProcessor.ts";
import {FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest} from "fastify";
import {DrawStore} from "../../lib/DrawStore.ts";

let store : DrawStore
const self = this
async function handleRequest(request: FastifyRequest, reply: FastifyReply) {


    let {name} = request.params as {name?: string}

    if (name) {
        let draw = store.getDraw(name)

        let reduced = new GeoJSONProcessor(name, draw).refine()

        return reply.code(200).type('application/json').send(JSON.stringify(reduced))
    }
    return reply.code(404).type('application/json').send({error: "No name provided."})
}

const plugin: FastifyPluginCallback = (fastify, options : FastifyPluginOptions, next) : void => {


    store = options.drawStore

    fastify.get("/draws/:name/refine", handleRequest.bind(self))
    next()
}

export default plugin;
