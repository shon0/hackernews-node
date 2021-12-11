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

const startServer = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const schema = loadSchemaSync(join(__dirname, './schema.graphql'), {
    loaders: [new GraphQLFileLoader()],
  })
  const schemaWithResolvers = addResolversToSchema({ schema, resolvers })

  const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: '/graphql' },
  )

  const prisma = new PrismaClient()
  const pubsub = new PubSub()

  const server = new ApolloServer({
    schema: schemaWithResolvers,
    context: ({ req }) => ({
      ...req,
      prisma,
      pubsub,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        serverWillStart: async () => {
          return {
            drainServer: async () => {
              subscriptionServer.close()
            },
          }
        },
      },
    ],
  })

  await server.start()
  server.applyMiddleware({ app })

  await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve))
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
}

startServer()
