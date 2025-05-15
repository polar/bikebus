import {FastifyInstance, FastifyLoggerOptions} from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import build from "./build.ts";

import * as fs from "node:fs";
import {RoutesCache} from "../lib/RoutesCache.ts";

const loggerConfig : FastifyLoggerOptions = {
};
let exposeDocs = true;
let cache = new RoutesCache();

fs.readdirSync("./src/stuff/routes").forEach(file => {
    let route = file.replace(".json", "")
    cache.add(route)
})

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
