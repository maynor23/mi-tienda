import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();

  const product = await prisma.product.update({
    where: { id: Number(id) },
    data: {
      name: body.name,
      price: Number(body.price),
      description: body.description,
      image: body.image,
      category_id: Number(body.category_id),
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await prisma.product.delete({
    where: { id: Number(id) },
  });

  return NextResponse.json({ ok: true });
}