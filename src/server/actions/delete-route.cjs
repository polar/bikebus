var fs = require('fs');
var path = require('path');

module.exports = (fastify, options, next ) => {
    var cache

    async function handleRequest(request , reply ) {

        const {name} = request.params;

        let fname = path.join(__dirname, "../..", "stuff/routes", name + ".json")

        if (fs.existsSync(fname)) {
            try {
                fs.unlinkSync(fname)
                cache.remove(name, null)
                return reply.code(200)
                    .type("text/plain")
                    .send("Route was deleted.")
            } catch (err) {
                return reply.code(403)
                    .type("text/plain")
                    .send("Route was not deleted.")
            }
        } else {
            cache.remove(name)
            return reply.code(404)
                .type("text/plain")
                .send("Route was not found.")
        }
    }

    cache = options.cache

    fastify.delete("/route/:name", handleRequest.bind(module))
    next()
}
