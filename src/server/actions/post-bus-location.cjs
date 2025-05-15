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

        let location = {
            timestamp: request.body.timestamp,
            latitude: request.body.latitude,
            longitude: request.body.longitude,
        }
        cache.setLocation(route, location)

        return reply.code(200)
            .type("application/json")
            .send(JSON.stringify(location))
    }

    cache = options.cache

    fastify.post("/tracker/:route/location", handleRequest.bind(module))
    next()
}
