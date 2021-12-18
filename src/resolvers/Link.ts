import { LinkResolvers } from '../types/generated/graphql'

const postedBy: LinkResolvers['postedBy'] = (parent, _args, context) => {
  return context.prisma.link.findUnique({ where: { id: parent.id } }).postedBy()
}

const votes: LinkResolvers['votes'] = (parent, _args, context) => {
  return context.prisma.link.findUnique({ where: { id: parent.id } }).votes()
}

export const Link: LinkResolvers = {
  postedBy,
  votes,
}
