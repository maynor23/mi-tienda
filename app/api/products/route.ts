import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { id: "desc" },
  });

  return Response.json(products);
}

export async function POST(req: Request) {
  const body = await req.json();

  const product = await prisma.product.create({
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