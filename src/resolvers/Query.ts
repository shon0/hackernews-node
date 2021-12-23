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
    orderBy: args.orderBy
      ? {
          description: args.orderBy.description ?? undefined,
          url: args.orderBy.url ?? undefined,
          createdAt: args.orderBy.createdAt ?? undefined,
        }
      : {},
  })
}

export const Query: QueryResolvers = {
  feed,
}
