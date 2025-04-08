import fastify, { FastifyInstance, FastifyServerOptions } from "fastify";
import { userSchema } from "./schemas/user";
import { errorSchema } from "./schemas/error";
import { fastifyStatic } from "@fastify/static"
import { fastifyCors} from "@fastify/cors";
interface BuildOpts extends FastifyServerOptions {
    exposeDocs?: boolean;
}

const build = (opts?: BuildOpts): FastifyInstance => {
    const app = fastify({
        ...opts,
    });

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
            // Generate an error on other origins, disabling access
            cb(new Error("Not allowed"), false)
        }
    })

    app.register(fastifyStatic, {
        root: `${import.meta.dirname}/routes`,
        prefix: "/"
    })

    // add in common schemas
    app.addSchema(userSchema);
    app.addSchema(errorSchema);

    return app;
};

export default build;
