import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  globalThis.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  });

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

// Middleware para soft delete e auditoria automática
prisma.$use(async (params, next) => {
  // Log de queries em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    const start = Date.now();
    const result = await next(params);
    const end = Date.now();
    console.log(`Query ${params.model}.${params.action} took ${end - start}ms`);
    return result;
  }

  return next(params);
});

export default prisma;