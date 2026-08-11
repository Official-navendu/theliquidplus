import { PrismaClient } from '@prisma/client';

/**
 * Neon scales compute to zero after inactivity. Prisma's default connect timeout
 * is too short for wake-up, which surfaces as P1001 "Can't reach database server".
 * Neon also may append channel_binding=require; Prisma's engine does not need it
 * and it can add handshake friction on pooled connections.
 *
 * @see https://neon.tech/docs/guides/prisma#connection-timeouts
 */
function resolveDatabaseUrl(raw: string | undefined): string | undefined {
  if (!raw) return raw;

  try {
    const url = new URL(raw);
    url.searchParams.delete('channel_binding');
    if (!url.searchParams.get('sslmode')) {
      url.searchParams.set('sslmode', 'require');
    }
    if (!url.searchParams.get('connect_timeout')) {
      url.searchParams.set('connect_timeout', '15');
    }
    return url.toString();
  } catch {
    return raw;
  }
}

const databaseUrl = resolveDatabaseUrl(process.env.DATABASE_URL);

// Prevent multiple instances of Prisma Client in development hot reloading
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: databaseUrl
      ? {
          db: { url: databaseUrl },
        }
      : undefined,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}

export default db;
