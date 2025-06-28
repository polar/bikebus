import fastify, { FastifyInstance, FastifyServerOptions } from "fastify";
import { userSchema } from "../schemas/user.ts";
import { errorSchema } from "../schemas/error.ts";
import { fastifyStatic } from "@fastify/static"
import { fastifyCors} from "@fastify/cors";
import {fastifyAutoload} from "@fastify/autoload";
import {fastifyCookie} from "@fastify/cookie";
import {fastifySession} from "@fastify/session";

interface BuildOpts extends FastifyServerOptions {
    exposeDocs?: boolean,
    cache?: any
    drawStore?: any
    idGenerator: () => string
}

const build = (opts?: BuildOpts): FastifyInstance => {
    const app = fastify(opts);
    app.register(fastifyCookie)
    app.register(fastifySession, {
        secret: "cNaoPYAwF60HZJzkcNaoPYAwF60HZJzk",
        cookie: { secure: false, maxAge: 1000*60*60*60*24 },
    })
    app.register(fastifyCors, {
        origin:  (origin, cb) => {
            if (origin === undefined) {
                cb(null, true)
                return
            }
            const hostname = new URL(origin!).hostname
            if(hostname === "localhost"){
                //  Request from localhost will pass
                cb(null, true)
                return
            }
            if(hostname === "adiron.com"){
                //  Request from localhost will pass
                cb(null, true)
                return
            }
            // Generate an error on other origins, disabling access
            cb(new Error("Not allowed"), false)
        }
    })

    app.register(fastifyAutoload, {
        dir: `${import.meta.dirname}/actions`,
        options:{
            cache: opts!.cache,
            drawStore: opts!.drawStore,
            idGenerator: opts!.idGenerator
        }
    })

    app.register(fastifyStatic, {
        root: `${import.meta.dirname}/../stuff`,
        prefix: "/"
    })

    // add in common schemas
    app.addSchema(userSchema);
    app.addSchema(errorSchema);

    return app;
};

export default build;
