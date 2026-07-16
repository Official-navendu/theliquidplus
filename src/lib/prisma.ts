import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Configure Prisma logging for development
const logOptions = process.env.NODE_ENV === 'development'
  ? [
      { emit: 'event' as const, level: 'query' as const },
      { emit: 'stdout' as const, level: 'error' as const },
      { emit: 'stdout' as const, level: 'info' as const },
      { emit: 'stdout' as const, level: 'warn' as const },
    ]
  : [
      { emit: 'stdout' as const, level: 'error' as const },
    ];

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: logOptions,
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Log queries in development
if (process.env.NODE_ENV === 'development') {
  (prisma as unknown as { $on: (event: string, callback: (event: { query: string; params: string; duration: number }) => void) => void }).$on('query', (e) => {
    logger.info({ query: e.query, params: e.params, duration: `${e.duration}ms` }, 'Prisma Query');
  });
}

// Configure graceful Prisma disconnect handling on process termination
const handleGracefulShutdown = async () => {
  logger.info('Gracefully disconnecting from database...');
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGTERM', handleGracefulShutdown);
process.on('SIGINT', handleGracefulShutdown);

export default prisma;
