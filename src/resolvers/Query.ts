import { QueryResolvers } from '../types/generated/graphql'

const feed: QueryResolvers['feed'] = async (_parent, args, context) => {
  return context.prisma.link.findMany({
    where: args.filter
      ? {
          OR: [{ description: { contains: args.filter } }, { url: { contains: args.filter } }],
        }
      : {},
    skip: args.skip ?? undefined,
    take: args.take ?? undefined,
  })
}

export const Query: QueryResolvers = {
  feed,
}
