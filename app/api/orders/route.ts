import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cliente, productos, total } = body;

    // Guardar orden en BD
    const order = await prisma.order.create({
      data: {
        name: cliente.name,
        phone: cliente.phone,
        address: cliente.address,
        total,
        items: {
          create: productos.map((p: any) => ({
            productId: p.id,
            name: p.name,
            price: p.price,
            quantity: p.quantity,
          })),
        },
      },
      include: { items: true },
    });

    // Devolver la orden creada
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("ERROR AL CREAR PEDIDO:", error);
    return NextResponse.json({ error: "Error al crear pedido" }, { status: 500 });
  }
}
