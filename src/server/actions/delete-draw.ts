
import {FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest} from "fastify";
import {getBusInfoLineStringLastTimestamp} from "../../lib/BusInfo.ts";
import {DrawStore} from "../../lib/DrawStore.ts";

const self = this
let store : DrawStore

async function handleRequest(request: FastifyRequest, reply : FastifyReply) {

    let {name} = request.params as {name?: string}

    if (name) {
        store.removeDraw(name)
        let draws = store.getDraws()

        let result = draws.map((d:any) => {
            return ({name: d, lastModified: getBusInfoLineStringLastTimestamp(store.getDraw(d))})
        })
        return reply.code(200).type('application/json').send(JSON.stringify(result))
    }
    return reply.code(404).type('application/json').send({error: "No name provided."})
}

const plugin : FastifyPluginCallback = (fastify, options : FastifyPluginOptions, next) => {

    store = options.drawStore

    fastify.delete("/draws/:name", handleRequest.bind(self))
    next()
}

export default plugin;
