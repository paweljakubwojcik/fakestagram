import { MikroORM } from "@mikro-orm/core"
import { AbstractSqlConnection, AbstractSqlDriver } from "@mikro-orm/postgresql"
import { ApolloServer } from "apollo-server-express"
import connectRedis from "connect-redis"
import express from "express"
import session from "express-session"
import "module-alias/register"
import { createClient } from "redis"
import { buildSchema } from "type-graphql"
import { __prod__ } from "./constants"
import micrOrmConfig from "./mikro-orm.config"
import { resolvers } from "./resolvers/index"
import { MyContext } from "./types/context"
import cors from "cors"

;(async () => {
  const orm = await MikroORM.init<AbstractSqlDriver<AbstractSqlConnection>>(
    micrOrmConfig
  )
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
      origin: "http://localhost:3000",
    })
  )

  app.use(
    session({
      name: "instaclone_auth",
      store: new RedisStore({
        client: redisClient,
        disableTouch: true,
      }),
      saveUninitialized: false,
      secret: "Your'e a wizard Harry", //TODO: hide this
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
    context: ({ req, res }): MyContext => ({ em: orm.em.fork(), req, res }),
  })
  await apolloServer.start()
  apolloServer.applyMiddleware({ app, cors: false })

  await new Promise<void>((resolve) => app.listen({ port: 4000 }, resolve))
  console.log("server running on http://localhost:4000/graphql")
})()
