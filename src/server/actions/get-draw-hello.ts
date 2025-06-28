import {FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest} from "fastify";
import {DrawStore} from "../../lib/DrawStore.ts";

let store : DrawStore
let self = this

let idGenerator : () => string


async function handleRequest(request: FastifyRequest, reply:FastifyReply) {

    let userName
    let tries = 20
    // @ts-ignore
    if (!request.query.not && request.session && request.session.name && request.session.name !== request.params.not) {
        // @ts-ignore
        userName = request.session.name
    } else {
        while(!userName) {
            userName = idGenerator()
            // @ts-ignore
            if (request.query.not && request.query.not === userName || store.has(userName)) {
                userName = undefined
                if (--tries <= 0) {
                    userName = "drawOverflow" // It will get overwritten
                }
            }
        }
        // @ts-ignore
        request.session.name = userName
        store.addDraw(userName)
    }


    return reply.code(200).type('application/json').send({name: userName})
}

const plugin : FastifyPluginCallback = (fastify, options: FastifyPluginOptions, next) => {


    store = options.drawStore
    idGenerator = options.idGenerator

    fastify.get("/draw/hello", handleRequest.bind(self))
    next()
}

export default plugin;
