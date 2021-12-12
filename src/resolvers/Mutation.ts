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
  })

  context.pubsub.publish('NEW_LINK', { newLink: { id: newLink.id } })

  return newLink
}

export const Mutation: MutationResolvers = {
  signup,
  login,
  post,
}
