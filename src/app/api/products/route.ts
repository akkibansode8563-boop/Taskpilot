import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createProductSchema } from "@/lib/validations";

// GET /api/products — list products with optional search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const supplierId = searchParams.get("supplierId");

    const where: Record<string, unknown> = {};

    if (supplierId) where.defaultSupplierId = supplierId;

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        { hsCode: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        defaultSupplier: { select: { id: true, name: true } },
        _count: { select: { orderItems: true } },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products — create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = createProductSchema.parse(body);

    // Get or create default user
    let user = await prisma.user.findFirst();
    if (!user) {
      user = await prisma.user.create({
        data: { email: "user@taskpilot.com", name: "User" },
      });
    }

    const product = await prisma.product.create({
      data: {
        sku: validated.sku,
        name: validated.name,
        brand: validated.brand,
        hsCode: validated.hsCode,
        unit: validated.unit || "pcs",
        unitCost: validated.unitCost,
        weight: validated.weight,
        cbm: validated.cbm,
        description: validated.description,
        notes: validated.notes,
        defaultSupplierId: validated.defaultSupplierId || null,
        userId: user.id,
      },
      include: {
        defaultSupplier: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
