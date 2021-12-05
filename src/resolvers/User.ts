import { UserResolvers } from '../types/generated/graphql'

const links: UserResolvers['links'] = (parent, _args, context) => {
  return context.prisma.user.findUnique({ where: { id: parent.id } }).links()
}

export const User: UserResolvers = {
  links,
}
