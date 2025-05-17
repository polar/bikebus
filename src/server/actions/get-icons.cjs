var fs = require('fs');

module.exports = (fastify, options, next) => {

    async function handleRequest(request, reply) {
        let icons = []

        fs.readdirSync("./src/stuff/bus-icons").forEach(file => {
            icons.push(file)
        })
        return reply.code(200).type('application/json').send(JSON.stringify(icons))
    }

    fastify.get("/bus-icons", handleRequest.bind(module))
    next()
}
