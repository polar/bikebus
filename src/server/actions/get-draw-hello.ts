import {FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest} from "fastify";
import {DrawStore} from "../../lib/DrawStore.ts";

let store : DrawStore
let self = this

let idGenerator : () => string


async function handleRequest(request: FastifyRequest, reply:FastifyReply) {

    let hello
    let tries = 20
    // @ts-ignore
    if (!request.query.not && request.session && request.session.hello && request.session.hello !== request.params.not) {
        // @ts-ignore
        hello = request.session.hello
    } else {
        while(!hello) {
            hello = idGenerator()
            // @ts-ignore
            if (request.query.not && request.query.not === hello || store.has(hello)) {
                hello = undefined
                if (--tries <= 0) {
                    hello = "drawOverflow" // It will get overwritten
                }
            }
        }
        // @ts-ignore
        request.session.hello = hello
        store.addDraw(hello)
    }


    return reply.code(200).type('application/json').send({name: hello})
}

const plugin : FastifyPluginCallback = (fastify, options: FastifyPluginOptions, next) => {


    store = options.drawStore
    idGenerator = options.idGenerator

    fastify.get("/draw/hello", handleRequest.bind(self))
    next()
}

export default plugin;
