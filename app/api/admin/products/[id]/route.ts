import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await context.params;
  const id = parseInt(idParam, 10);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { name, price, description, image, category_id } = body;

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
    return NextResponse.json(
      { error: "Error actualizando producto" },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id: idParam } = await context.params;
  const id = parseInt(idParam, 10);

  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Error eliminando producto" },
      { status: 500 }
    );
  }
}