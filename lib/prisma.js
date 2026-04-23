import { PrismaClient } from "@prisma/client";

// Usamos una variable global para evitar múltiples instancias en desarrollo
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"],
  });

// En desarrollo guardamos la instancia en global
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
