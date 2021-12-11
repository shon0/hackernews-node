import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import express from 'express'
import http from 'http'
import { loadSchemaSync } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { addResolversToSchema, makeExecutableSchema } from '@graphql-tools/schema'
import { join } from 'path'
import { getUserId } from './utils'
import { resolvers } from './resolvers'

async function startApolloServer() {
  const schema = loadSchemaSync(join(__dirname, './schema.graphql'), {
    loaders: [new GraphQLFileLoader()],
  })
  const schemaWithResolvers = addResolversToSchema({ schema, resolvers })

  const app = express()
  const httpServer = http.createServer(app)

  const prisma = new PrismaClient()

  const server = new ApolloServer({
    schema: schemaWithResolvers,
    context: ({ req }) => ({
      ...req,
      prisma,
      userId: req && req.headers.authorization ? getUserId(req) : null,
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await server.start()
  server.applyMiddleware({
    app,
    path: '/',
  })

  await new Promise<void>(resolve => httpServer.listen({ port: 4000 }, resolve))
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
}

startApolloServer()
