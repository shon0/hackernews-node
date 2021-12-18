import { Context } from '../types/context'
import { SubscriptionResolvers } from '../types/generated/graphql'

const newLink = {
  subscribe: (_parent: any, _args: any, { pubsub }: { pubsub: Context['pubsub'] }) => {
    return pubsub.asyncIterator(['NEW_LINK'])
  },
} as unknown as SubscriptionResolvers['newLink'] // codegenと型が噛み合わないのでアサーション

const newVote = {
  subscribe: (_parent: any, _args: any, { pubsub }: { pubsub: Context['pubsub'] }) => {
    return pubsub.asyncIterator(['NEW_VOTE'])
  },
} as unknown as SubscriptionResolvers['newVote'] // codegenと型が噛み合わないのでアサーション

export const Subscription: SubscriptionResolvers = {
  newLink,
  newVote,
}
