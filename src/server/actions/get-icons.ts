import {FastifyPluginCallback, FastifyPluginOptions, FastifyReply, FastifyRequest} from "fastify";
import fs from "node:fs";

let self = this

async function handleRequest(_request : FastifyRequest, reply: FastifyReply) {
    let icons  : string[] = []

    fs.readdirSync("./src/stuff/bus-icons").forEach(file => {
        icons.push(file)
    })
    return reply.code(200).type('application/json').send(JSON.stringify(icons))
}

const plugin : FastifyPluginCallback = (fastify, _options: FastifyPluginOptions, next) => {

    fastify.get("/bus-icons", handleRequest.bind(self))
    next()
}
export default plugin;
