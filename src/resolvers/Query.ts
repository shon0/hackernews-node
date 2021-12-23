import { QueryResolvers } from '../types/generated/graphql'

const feed: QueryResolvers['feed'] = async (_parent, args, context) => {
  const links = await context.prisma.link.findMany({
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

  const count = await context.prisma.link.count()

  return { links, count }
}

export const Query: QueryResolvers = {
  feed,
}
