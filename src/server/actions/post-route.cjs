
var fs = require('fs');
var path = require('path');

function getBusInfoTitle(geojson ) {
    if (geojson) {
        let ls = getBusInfoLineString(geojson);
        if (ls) {
            return (ls.properties.title || "").replaceAll(" ", "_")
        }
    }
}

function getBusInfoLineString(geojson){
    return geojson.features.find((f) => f.type === "Feature" && f.geometry.type === "LineString")
}

function ensureBusInfoTitle(geojson) {
    if (geojson) {
        let ls = getBusInfoLineString(geojson)
        if (ls) {
            ls.properties.title ||= ""
        }
        return geojson
    }
}

module.exports = (fastify, options, next ) => {
    var cache
    async function handleRequest(request , reply ) {

        let json = request.body
        if (json && json.features) {
            ensureBusInfoTitle(json)
            let name = getBusInfoTitle(json)
            if (name) {
                console.log(name, "WTF")
                    // Fastify has a built-in 1M limit on the body of the request.
                    // So, we just limit the number of routes we will store. Use the cache.
                    if (cache.atLimit() && !cache.has(name)) {
                        return reply.code(452).type("text/plain").send("Too many routes on the server")
                    }
                        //                      actions / server / src /
                    let fname = path.join(__dirname, "../..", "stuff/routes", name + ".json")

                    if (fs.existsSync(fname)) {
                        return reply.code(409).type('text/plain').send('Route Will be overwritten.');
                    } else {
                        fs.writeFileSync(fname, JSON.stringify(json, null, 2), 'utf8');
                        cache.add(name)
                        return reply.code(200).type("application/json").send(json)
                    }
            } else {
                return reply.code(400).type("text/plain").send('Route requires a non empty name.')
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
