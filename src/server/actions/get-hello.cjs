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

        const {type, user} = request.query

        let userName = user
        if (!user && request.session.user) {
            userName = request.session.user
        } else {
            userName = options.idGenerator()
            reply.session.user = userName
        }


        return reply.code(200).type('application/json').send({type: type, user: userName, route: route})
    }

    cache = options.cache

    fastify.get("/tracker/:route/hello", handleRequest.bind(module))
    next()
}
