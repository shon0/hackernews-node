import { QueryResolvers } from '../types/generated/graphql'

const feed: QueryResolvers['feed'] = async (_parent, _args, context) => {
  return context.prisma.link.findMany()
}

export const Query: QueryResolvers = {
  feed
}