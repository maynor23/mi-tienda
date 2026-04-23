import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Obtener todos los productos
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true }, // Incluye la categoría asociada
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/admin/products error:", error);
    return NextResponse.json({ error: "Error obteniendo productos" }, { status: 500 });
  }
}

// Crear un nuevo producto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, price, description, image, category_id } = body;

    if (!name || price === undefined || price === null || !category_id) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: name, price o category_id" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        description: description ?? null,
        image: image ?? null,
        category_id: Number(category_id),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("POST /api/admin/products error:", error);
    return NextResponse.json({ error: "Error creando producto" }, { status: 500 });
  }
}
