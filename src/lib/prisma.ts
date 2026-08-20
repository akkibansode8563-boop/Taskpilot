import { PrismaClient } from "@prisma/client";
import { mockData } from "./mock-data";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create a proxy-based mock that returns mock data for any model call
function createMockProxy(): PrismaClient {
  const models: Record<string, unknown[]> = {
    task: mockData.tasks as unknown[],
    order: mockData.orders as unknown[],
    supplier: mockData.suppliers as unknown[],
    product: mockData.products as unknown[],
    salesOrder: mockData.salesOrders as unknown[],
    serviceTicket: mockData.serviceTickets as unknown[],
    notification: mockData.notifications as unknown[],
    document: mockData.documents as unknown[],
    payment: mockData.payments as unknown[],
    shipment: mockData.shipments as unknown[],
    landedCostEntry: mockData.landedCosts as unknown[],
    user: [mockData.user] as unknown[],
    taskActivity: [] as unknown[],
    orderItem: [] as unknown[],
  };

  const modelProxy = (modelName: string) => {
    const data = models[modelName] || [];
    return new Proxy(
      {},
      {
        get: (_target, prop) => {
          const methodName = String(prop);
          if (["findMany", "findUnique", "findUniqueOrThrow", "findFirst", "findFirstOrThrow"].includes(methodName)) {
            return (args?: Record<string, unknown>) => {
              let result = [...data];
              if (args?.where) {
                const where = args.where as Record<string, unknown>;
                result = result.filter((item) => {
                  const obj = item as Record<string, unknown>;
                  return Object.entries(where).every(([key, value]) => obj[key] === value);
                });
              }
              if (args?.orderBy && result.length > 0) {
                const orderBy = args.orderBy as Record<string, string>;
                const [field, direction] = Object.entries(orderBy)[0];
                result.sort((a, b) => {
                  const aObj = a as Record<string, unknown>;
                  const bObj = b as Record<string, unknown>;
                  if (direction === "desc") return (bObj[field] as number) > (aObj[field] as number) ? 1 : -1;
                  return (aObj[field] as number) > (bObj[field] as number) ? 1 : -1;
                });
              }
              if (methodName === "findUnique" || methodName === "findUniqueOrThrow") {
                return result[0] || null;
              }
              if (methodName === "findFirst" || methodName === "findFirstOrThrow") {
                return result[0] || null;
              }
              if (args?.skip) result = result.slice(Number(args.skip));
              if (args?.take) result = result.slice(0, Number(args.take));
              return Promise.resolve(result);
            };
          }
          if (methodName === "count") {
            return () => Promise.resolve(data.length);
          }
          if (methodName === "create") {
            return (args: { data: Record<string, unknown> }) => {
              const newItem = { id: `mock-${Date.now()}`, createdAt: new Date(), updatedAt: new Date(), ...args.data };
              data.push(newItem);
              return Promise.resolve(newItem);
            };
          }
          if (methodName === "update") {
            return (args: { where: Record<string, unknown>; data: Record<string, unknown> }) => {
              const idx = data.findIndex((item) => {
                const obj = item as Record<string, unknown>;
                return Object.entries(args.where).every(([k, v]) => obj[k] === v);
              });
              if (idx >= 0) {
                data[idx] = { ...(data[idx] as Record<string, unknown>), ...args.data, updatedAt: new Date() };
                return Promise.resolve(data[idx]);
              }
              return Promise.resolve(null);
            };
          }
          if (methodName === "delete") {
            return (args: { where: Record<string, unknown> }) => {
              const idx = data.findIndex((item) => {
                const obj = item as Record<string, unknown>;
                return Object.entries(args.where).every(([k, v]) => obj[k] === v);
              });
              if (idx >= 0) {
                const deleted = data.splice(idx, 1)[0];
                return Promise.resolve(deleted);
              }
              return Promise.resolve(null);
            };
          }
          if (methodName === "upsert") {
            return (args: { where: Record<string, unknown>; create: Record<string, unknown>; update: Record<string, unknown> }) => {
              const idx = data.findIndex((item) => {
                const obj = item as Record<string, unknown>;
                return Object.entries(args.where).every(([k, v]) => obj[k] === v);
              });
              if (idx >= 0) {
                data[idx] = { ...(data[idx] as Record<string, unknown>), ...args.update, updatedAt: new Date() };
                return Promise.resolve(data[idx]);
              }
              const newItem = { id: `mock-${Date.now()}`, createdAt: new Date(), updatedAt: new Date(), ...args.create };
              data.push(newItem);
              return Promise.resolve(newItem);
            };
          }
          return () => Promise.resolve(null);
        },
      }
    );
  };

  return new Proxy({} as PrismaClient, {
    get: (_target, prop) => {
      const propName = String(prop);
      if (propName === "$connect") return () => Promise.resolve();
      if (propName === "$disconnect") return () => Promise.resolve();
      if (propName === "$transaction") {
        return (fn: (tx: unknown) => Promise<unknown>) => fn({});
      }
      return modelProxy(propName);
    },
  }) as PrismaClient;
}

function createPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL || "";
  if (!dbUrl || dbUrl.includes("[YOUR-") || dbUrl.includes("placeholder")) {
    console.log("📦 No database configured — running in demo mode with mock data");
    return createMockProxy();
  }
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  } catch {
    console.log("⚠️  Database connection failed — falling back to demo mode");
    return createMockProxy();
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
