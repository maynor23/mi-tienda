import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const data = await req.formData();
    const file = data.get("file") as File;

    if (!file) {
      return Response.json(
        { error: "No se envió archivo" },
        { status: 400 }
      );
    }

    // 🧠 validar tipo (solo imágenes)
    if (!file.type.startsWith("image/")) {
      return Response.json(
        { error: "Solo imágenes permitidas" },
        { status: 400 }
      );
    }

    // 🧠 validar tamaño (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return Response.json(
        { error: "Imagen muy pesada (max 2MB)" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 🧾 nombre único
    const fileName = Date.now() + "_" + file.name;

    const filePath = path.join(
      process.cwd(),
      "public/products",
      fileName
    );

    await writeFile(filePath, buffer);

    return Response.json({
      url: `/products/${fileName}`,
    });

  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    return Response.json(
      { error: "Error al subir imagen" },
      { status: 500 }
    );
  }
}