import {FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest} from "fastify";
import {MakeStore} from "../../lib/MakeStore.ts";

const self = this
let routesStore : MakeStore
let archiveStore : MakeStore

async function handleRequest(request: FastifyRequest, reply : FastifyReply) {

    let {name} = request.params as {name?: string}

    if (name) {
        let make = archiveStore.getMake(name)
        routesStore.addMake(name, make)
        archiveStore.removeMake(name)
        let makes = archiveStore.getMakes()

        let result = makes.map((d:any) => {
            return ({name: d})
        })
        return reply.code(200).type('application/json').send(JSON.stringify(result))
    }
    return reply.code(404).type('application/json').send({error: "No name provided."})
}

const plugin : FastifyPluginCallback = (fastify, options : FastifyPluginOptions, next) => {

    routesStore = options.routeStore
    archiveStore = options.archiveStore

    fastify.post("/archive/:name/restore", handleRequest.bind(self))
    next()
}

export default plugin;
