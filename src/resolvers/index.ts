import { Resolvers } from '../types/generated/graphql'

import { Query } from './Query'
import { Mutation } from './Mutation'
import { Subscription } from './Subscription'
import { User } from './User'
import { Link } from './Link'
import { Vote } from './Vote'

export const resolvers: Resolvers = {
  Query,
  Mutation,
  Subscription,
  User,
  Link,
  Vote,
}
