import { Resolvers } from '../types/generated/graphql'

import { Query } from './Query'
import { Mutation } from './Mutation'
import { User } from './User'
import { Link } from './Link'

export const resolvers: Resolvers = {
  Query,
  Mutation,
  User,
  Link,
}
