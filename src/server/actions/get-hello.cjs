module.exports = (fastify, options, next) => {
    var cache

    async function handleRequest(request, reply) {

        const {route} = request.params;
        if (!cache.has(route)) {
            return reply
                .code(404)
                .type('text/plain')
                .send('Route not found.')
        }

        const {type} = request.query

        return reply.code(200).type('application/json').send({type: type, route: route})
    }

    cache = options.cache

    fastify.get("/tracker/:route/hello", handleRequest.bind(module))
    next()
}
