import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server'
import fs from 'fs'
import path from 'path'

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: async (parent: any, args: any, context: any) => {
      return context.prisma.link.findMany()
    },
  },
  Mutation: {
    post: (parent: any, args: any, context: any, info: any) => {
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

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
  resolvers,
  context: {
    prisma,
  },
})

server.listen().then(({ url }) => console.log(`Server is running on ${url}`))
