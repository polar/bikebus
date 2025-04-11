module.exports = (fastify, options, next ) => {
    var cache

    async function handleRequest(request , reply ) {

        const {route} = request.params;
        if (!cache.get(route)) {
            return reply
                .code(404)
                .type('text/plain')
                .send('Route not found.');
        }

        cache.set(`location-${route}`, null)

        return reply.code(200)
            .type("application/json")
            .send()
    }

    cache = options.cache

    fastify.delete("/tracker/:route/location", handleRequest.bind(module))
    next()
}
