import { join } from 'path'
import http from 'http'
import express from 'express'
import { execute, subscribe } from 'graphql'
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import { loadSchemaSync } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { addResolversToSchema } from '@graphql-tools/schema'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { PubSub } from 'graphql-subscriptions'
import { PrismaClient } from '@prisma/client'
import { getUserId } from './utils'
import { resolvers } from './resolvers'

const PORT = 4000

const startServer = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const loadedSchema = loadSchemaSync(join(__dirname, './schema.graphql'), {
    loaders: [new GraphQLFileLoader()],
  })
  const schema = addResolversToSchema({ schema: loadedSchema, resolvers })

  const prisma = new PrismaClient()
  const pubsub = new PubSub()

  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({
      ...req,
      prisma,
      pubsub,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await server.start()
  server.applyMiddleware({ app })

  SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: server.graphqlPath },
  )

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  })
}

startServer()
