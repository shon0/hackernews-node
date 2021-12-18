import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { APP_SECRET } from '../utils'
import { MutationResolvers } from '../types/generated/graphql'

const signup: MutationResolvers['signup'] = async (_parent, args, context) => {
  const password = await bcrypt.hash(args.password, 10)
  const user = await context.prisma.user.create({ data: { ...args, password } })
  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return { token, user }
}

const login: MutationResolvers['login'] = async (_parent, args, context) => {
  const user = await context.prisma.user.findUnique({ where: { email: args.email } })
  if (!user) throw new Error('No such user found')

  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) throw new Error('Invalid password')

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return { token, user }
}

const post: MutationResolvers['post'] = async (_parent, args, context) => {
  const { userId } = context

  if (!userId) throw new Error('Not authenticated')

  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
    include: {
      postedBy: true,
    },
  })

  context.pubsub.publish('NEW_LINK', { newLink })

  return { ...newLink }
}

const vote: MutationResolvers['vote'] = async (_parent, args, context) => {
  const userId = context.userId
  
  if (!userId) {
    throw new Error(`Authentication error`)
  }

  const vote = await context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        linkId: args.linkId,
        userId: userId || '',
      },
    },
  })

  if (vote) {
    throw new Error(`Already voted for link: ${args.linkId}`)
  }

  const newVote = context.prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: args.linkId } },
    },
  })

  context.pubsub.publish("NEW_VOTE", newVote)

  return newVote
}

export const Mutation: MutationResolvers = {
  signup,
  login,
  post,
  vote
}
