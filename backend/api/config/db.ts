import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectDatabase = async (): Promise<void> => {
  await prisma.$connect()
    .then(() => console.log('[Prisma] Database connected successfully'))
    .catch((err: Error) => {
      console.error('[Prisma] Database connection failed:', err.message);
      process.exit(1);
    });
};

export default prisma;
