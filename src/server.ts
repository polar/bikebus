import {FastifyInstance, FastifyLoggerOptions} from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";
import build from "./app";

const loggerConfig : FastifyLoggerOptions = {
};
let exposeDocs = true;
if (process.env.NODE_ENV === "production") {
    exposeDocs = true;
}
const app: FastifyInstance<Server, IncomingMessage, ServerResponse> = build({
    logger: loggerConfig,
    exposeDocs,
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
