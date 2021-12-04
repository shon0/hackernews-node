import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server'
import { loadSchemaSync } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { join } from 'path'
import { addResolversToSchema } from '@graphql-tools/schema'
import { Resolvers } from './types/generated/graphql'

const schema = loadSchemaSync(join(__dirname, './schema.graphql'), {
  loaders: [new GraphQLFileLoader()],
})

const resolvers: Resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: async (_parent, _args, context) => {
      return context.prisma.link.findMany()
    },
  },
  Mutation: {
    post: (_parent, args, context) => {
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        },
      })
      return newLink
    },
  },
}

const prisma = new PrismaClient()

const schemaWithResolvers = addResolversToSchema({ schema, resolvers })
const server = new ApolloServer({ schema: schemaWithResolvers, context: { prisma } })

server.listen().then(({ url }) => console.log(`Server is running on ${url}`))
