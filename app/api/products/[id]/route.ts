import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();

  const product = await prisma.product.update({
    where: { id: Number(params.id) },
    data: {
      name: body.name,
      price: Number(body.price),
      description: body.description,
      image: body.image,
      category_id: Number(body.category_id),
    },
  });

  return Response.json(product);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await prisma.product.delete({
    where: { id: Number(params.id) },
  });

  return Response.json({ ok: true });
}