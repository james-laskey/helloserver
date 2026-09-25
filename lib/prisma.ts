import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create the adapter using your database URL
const adapter = new PrismaPg({
  connectionString: process.env.POSTGRES_URL!,
});

// Initialize Prisma Client with the adapter
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;