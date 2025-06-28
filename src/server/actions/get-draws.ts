import {FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest} from "fastify";
import {getBusInfoLineStringLastTimestamp} from "../../lib/BusInfo.ts";
import {DrawStore} from "../../lib/DrawStore.ts";

let store : DrawStore
let self = this

async function handleRequest(_request: FastifyRequest, reply: FastifyReply) {

    let draws = store.getDraws()

    let result = draws.map((d: any) => {
        return ({name: d, lastModified: getBusInfoLineStringLastTimestamp(store.getDraw(d))})
    })
    return reply.code(200).type('application/json').send(JSON.stringify(result))
}

const plugin : FastifyPluginCallback = (fastify, options: FastifyPluginOptions, next) => {

    store = options.drawStore

    fastify.get("/draws", handleRequest.bind(self))
    next()
}
export default plugin;
