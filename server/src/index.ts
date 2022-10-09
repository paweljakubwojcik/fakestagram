import { MikroORM } from "@mikro-orm/core"
import type { EntityManager } from "@mikro-orm/postgresql"
import { ApolloServer } from "apollo-server-express"
import connectRedis from "connect-redis"
import cors from "cors"
import express from "express"
import session from "express-session"
import "module-alias/register"
import { createClient } from "redis"
import { buildSchema } from "type-graphql"
import { COOKIE_NAME, __prod__ } from "./constants"
import micrOrmConfig from "./mikro-orm.config"
import { resolvers } from "./resolvers/index"
import { MyContext } from "./types/context"

;(async () => {
    const orm = await MikroORM.init(micrOrmConfig)
    // apply migrations programmatically
    // await orm.getMigrator().up()

    const RedisStore = connectRedis(session)
    const redisClient = createClient({ legacyMode: true })
    redisClient
        .connect()
        .then(() => console.log("Redis connected"))
        .catch(console.error)

    const app = express()

    app.use(
        cors({
            credentials: true,
            origin: "http://localhost:3005",
        })
    )

    app.use(
        session({
            name: COOKIE_NAME,
            store: new RedisStore({
                client: redisClient,
                disableTouch: true,
            }),
            saveUninitialized: false,
            secret: process.env.SESSION_SECRET!,
            resave: false,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
                httpOnly: true,
                secure: __prod__, // https only
                sameSite: "lax", // csrf
                path: "/",
            },
        })
    )

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers,
            emitSchemaFile: true,
        }),
        context: ({ req, res }): MyContext => ({
            em: orm.em.fork() as EntityManager,
            req,
            res,
        }),
    })
    await apolloServer.start()
    apolloServer.applyMiddleware({ app, cors: false })

    await new Promise<void>((resolve) => app.listen({ port: 4000 }, resolve))
    console.log("server running on http://localhost:4000/graphql")
})()
