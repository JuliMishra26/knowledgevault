import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

import { env } from '@/config/env';
import { PrismaClient } from '../generated/prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// 1. Create a standard Node-Postgres connection pool pointing to your env string
const pool = new Pool({ connectionString: env.DATABASE_URL });

// 2. Wrap it inside Prisma's v7 adapter
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query', 'warn', 'error'],
    adapter,
  });

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
