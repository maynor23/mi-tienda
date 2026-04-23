import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return Response.json(categories);
  } catch (error) {
    console.error("ERROR CATEGORIES:", error);

    return Response.json(
      {
        error: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 }
    );
  }
}