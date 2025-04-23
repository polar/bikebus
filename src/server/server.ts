import {FastifyInstance, FastifyLoggerOptions} from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import build from "./build.ts";

import NanoCache from "nano-cache"
import * as fs from "node:fs";

const loggerConfig : FastifyLoggerOptions = {
};
let exposeDocs = true;
let cache = new NanoCache();
let routes: string[] = []

fs.readdirSync("./src/stuff/routes").forEach(file => {
    let route = file.replace(".json", "")
    routes.push(route)
    cache.set(route, "true")
})

if (process.env.NODE_ENV === "production") {
    exposeDocs = true;
}
const app: FastifyInstance<Server, IncomingMessage, ServerResponse> = build({
    logger: loggerConfig,
    exposeDocs: exposeDocs,
    cache: cache,
    routes: routes
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
