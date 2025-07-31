import {FastifyPluginCallback, FastifyPluginOptions} from "fastify";
// @ts-ignore
import fastifyPassport from '@fastify/passport'
import {Strategy} from "passport-google-oauth20"

const plugin : FastifyPluginCallback = (fastify, _options: FastifyPluginOptions, next) => {

    fastify.register(fastifyPassport.initialize())
    fastify.register(fastifyPassport.secureSession())

    fastifyPassport.use(new Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: "http://localhost:5173/api/auth/google/callback"
    }, (_accessToken: any, _refreshToken: any, profile: any, done: (arg0: null, arg1: any) => void) => {
        done(null, profile);
    }))

    fastifyPassport.registerUserSerializer(async (user: any, _request: any) => {
        return user;
    })

    fastifyPassport.registerUserDeserializer(async (user: any, _request: any) => {
        return user;
    })

    fastify.get("/auth/google/callback", {
            preValidation: fastifyPassport.authenticate('google', {scope: ['profile', 'email']})
        },
        async (_req, res) => {
            res.redirect("/")
        }
    )

    fastify.get("/login", fastifyPassport.authenticate('google', {scope: ['profile']}))
    fastify.get("/logout", async (_req, _res) => {
        //req.logout()
        return {success: true}
    })
    next()
}

export default plugin;
