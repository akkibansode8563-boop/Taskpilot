import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/search?q=xxx&module=ALL — global search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const module = searchParams.get("module") || "ALL";

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    const results: Record<string, unknown[]> = {};

    // Search tasks
    if (module === "ALL" || module === "TASKS") {
      results.tasks = await prisma.task.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { contactName: { contains: query, mode: "insensitive" } },
            { tags: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          dueDate: true,
          module: true,
        },
        orderBy: { updatedAt: "desc" },
        take: 10,
      });
    }

    // Search orders
    if (module === "ALL" || module === "ORDERS") {
      results.orders = await prisma.order.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { orderNumber: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { piRef: { contains: query, mode: "insensitive" } },
            { poRef: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          title: true,
          orderNumber: true,
          type: true,
          status: true,
          currentStage: true,
        },
        orderBy: { updatedAt: "desc" },
        take: 10,
      });
    }

    // Search suppliers
    if (module === "ALL" || module === "SUPPLIERS") {
      results.suppliers = await prisma.supplier.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { country: { contains: query, mode: "insensitive" } },
            { city: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          country: true,
          city: true,
        },
        orderBy: { name: "asc" },
        take: 10,
      });
    }

    // Search products
    if (module === "ALL" || module === "PRODUCTS") {
      results.products = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { sku: { contains: query, mode: "insensitive" } },
            { hsCode: { contains: query, mode: "insensitive" } },
            { brand: { contains: query, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          name: true,
          sku: true,
          hsCode: true,
          unitCost: true,
        },
        orderBy: { name: "asc" },
        take: 10,
      });
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("GET /api/search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
