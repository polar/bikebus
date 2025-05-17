import {FastifyInstance, FastifyLoggerOptions} from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import build from "./build.ts";

import {DEFAULT_ROUTES_LIMIT, RoutesCache} from "../lib/RoutesCache.ts";

const loggerConfig : FastifyLoggerOptions = {
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
