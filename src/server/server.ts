import {FastifyInstance, FastifyLoggerOptions} from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import build from "./build.ts";

import {DEFAULT_ROUTES_LIMIT, RoutesCache} from "../lib/RoutesCache.ts";

const loggerConfig : FastifyLoggerOptions = {
    // @ts-ignore
    transport: {
        target: 'pino-roll',
        options: {
            file: "logs/log.json",
            frequency: "daily",
            mkdir: true
        }
    },
    serializers: {
        res(reply) {
            let obj = {
                statusCode: reply.statusCode,
                method: reply.request?.method,
                url: reply.request?.url,
                // @ts-ignore
                payload: reply.payload
            }
            // The default
            return obj
        },
        req(request) {
            return {
                client: request.headers["x-forwarded-for"],
                method: request.method,
                user_agent: request.headers["user-agent"],
                url: request.url,
                path: request.routeOptions.url,
                parameters: request.params,
                // Including headers in the log could violate privacy laws,
                // e.g., GDPR. Use the "redact" option to remove sensitive
                // fields. It could also leak authentication data in the logs.
                //headers: request.headers
            };
        }
    }
};

const SERVER_ROUTES_LIMIT = DEFAULT_ROUTES_LIMIT

let exposeDocs = true;
let cache = new RoutesCache(SERVER_ROUTES_LIMIT);

cache.initialize();
cache.startUpdate();

if (process.env.NODE_ENV === "production") {
    exposeDocs = true;
}
const app: FastifyInstance<Server, IncomingMessage, ServerResponse> = build({
    logger: loggerConfig,
    exposeDocs: exposeDocs,
    cache: cache
});

let listenOpts = {
    port: 9090,
    host: "0.0.0.0"
}

app.listen(listenOpts, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});

app.addHook('preHandler', function (req, _reply, done) {
    if (req.body) {
        req.log.info({ body: req.body }, 'parsed body')
    }
    done()
})
app.addHook('onSend', function (_req, reply, payload, done) {
    try {
        // @ts-ignore
        reply.payload = JSON.parse(payload)
    } catch (e) {
        // @ts-ignore
        reply.payload = payload
    }
    done()
})
