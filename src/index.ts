import { ApolloServer } from 'apollo-server'
import fs from 'fs'
import path from 'path'

const links = [
  {
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL',
  },
]

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (_: any, args: any) => {
      const filteredLinks = links.filter(link => link.id === args.id)
      return filteredLinks.length > 0 ? filteredLinks[0] : null
    },
  },
  Mutation: {
    post: (_: any, args: any) => {
      let idCount = links.length

      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      }
      links.push(link)
      return link
    },
  },
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, 'schema.graphql'), 'utf8'),
  resolvers,
})

server.listen().then(({ url }) => console.log(`Server is running on ${url}`))
