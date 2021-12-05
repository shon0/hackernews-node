import { PrismaClient } from '@prisma/client'

export type Context = {
  prisma: PrismaClient
  userId: string | null
}
