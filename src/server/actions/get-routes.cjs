
module.exports = (fastify, options, next) => {

    async function handleRequest(request, reply) {
        let names = options.routes
        return reply.code(200).type('application/json').send(JSON.stringify(names))
    }

    fastify.get("/tracker/routes", handleRequest.bind(module))
    next()
}
