import { Context } from '../types/context'
import { SubscriptionResolvers } from '../types/generated/graphql'

const newLink = {
  subscribe: (_parent: any, _args: any, { pubsub }: Context) => {
    return pubsub.asyncIterator(['NEW_LINK'])
  },
  resolver: (payload: any) => {
    console.log(payload)
    return payload
  },
} as unknown as SubscriptionResolvers['newLink'] // codegenと型が噛み合わないのでアサーション

export const Subscription: SubscriptionResolvers = {
  newLink,
}
