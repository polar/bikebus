module.exports = (fastify, options, next ) => {
    var cache

    async function handleRequest(request , reply ) {

        const {route} = request.params;
        if (!cache.has(route)) {
            return reply
                .code(404)
                .type('text/plain')
                .send('Route not found.');
        }

        cache.removeLocation(route)

        return reply.code(200)
            .type("application/json")
            .send()
    }

    cache = options.cache

    fastify.delete("/tracker/:route/location", handleRequest.bind(module))
    next()
}
