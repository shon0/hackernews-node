import { VoteResolvers } from '../types/generated/graphql'

const link: VoteResolvers['link'] = async (parent, _args, context) => {
  const link = await context.prisma.vote.findUnique({ where: { id: parent.id } }).link()

  if (!link) throw new Error('link is not found')

  return link
}

const user: VoteResolvers['user'] = async (parent, _args, context) => {
  const user = await context.prisma.vote.findUnique({ where: { id: parent.id } }).user()

  if (!user) throw new Error('user is not found')

  return user
}

export const Vote: VoteResolvers = {
  link,
  user,
}
