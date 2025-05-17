
var fs = require('fs');
var path = require('path');

module.exports = (fastify, options, next ) => {
    var cache
    async function handleRequest(request , reply ) {
        let json = request.body
        if (json && json.features) {
            let ls = json.features.find(f => f.type === "Feature" && f.geometry.type === "LineString")
            if (ls) {
                    let name = ls.properties.title.replaceAll(" ", "_")
                    if (name) {
                        //                      actions / server / src /
                        let fname = path.join(__dirname, "../..", "stuff/routes", name + ".json")

                        if (fs.existsSync(fname)) {
                            return reply.code(409).type('text/plain').send('Route Will be overwritten.');
                        } else {
                            fs.writeFileSync(fname, JSON.stringify(json, null, 2), 'utf8');
                            cache.add(name)
                            return reply.code(200).type("application/json").send(json)
                        }
                    }
                }
        }
        return reply.code(400)
            .type("text/plain")
            .send("Invalid GeoJSON")
    }
    cache = options.cache
    fastify.post("/route", handleRequest.bind(module))
    next()
}
