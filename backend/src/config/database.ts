import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    console.log('[Prisma] Database connected successfully');
  } catch (err: any) {
    console.error('[Prisma] Database connection failed:', err.message);
    process.exit(1);
  }
};
