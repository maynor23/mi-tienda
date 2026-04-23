import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const body = await req.json();
    console.log("PUT /api/admin/products/:id body:", body);

    const { name, price, description, image, category_id } = body;

    if (!name || price === undefined || price === null || !category_id) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: name, price o category_id" },
        { status: 400 }
      );
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        price: Number(price),
        description: description ?? null,
        image: image ?? null,
        category_id: Number(category_id),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/admin/products/[id] error:", error);
    // Si prisma lanza un error por constraints, devolver mensaje claro
    return NextResponse.json({ error: "Error actualizando producto" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id, 10);
    if (Number.isNaN(id)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/products/[id] error:", error);
    return NextResponse.json({ error: "Error eliminando producto" }, { status: 500 });
  }
}
