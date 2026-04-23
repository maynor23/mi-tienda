"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category_id: number;
};

type Category = {
  id: number;
  name: string;
};

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category_id: "",
  });

  /* 📤 SUBIDA DE IMAGEN (DRAG & DROP + CLICK) */
  const uploadFile = async (file: File | undefined) => {
    if (!file) return;

    // 🔒 validación básica
    if (!file.type.startsWith("image/")) {
      return alert("Solo se permiten imágenes");
    }

    if (file.size > 2 * 1024 * 1024) {
      return alert("Máximo 2MB");
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.url) {
        setForm((prev) => ({
          ...prev,
          image: data.url,
        }));
      } else {
        alert(data.error || "Error subiendo imagen");
      }
    } catch (error) {
      console.error(error);
      alert("Error en subida");
    }

    setUploading(false);
  };

  /* LOAD */
  const loadProducts = async () => {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(data);
  };

  const loadCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  /* CREATE */
  const createProduct = async () => {
    if (!form.name || !form.price || !form.category_id) {
      return alert("Completa los campos obligatorios");
    }

    setLoading(true);

    await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        category_id: parseInt(form.category_id),
      }),
    });

    setForm({
      name: "",
      price: "",
      description: "",
      image: "",
      category_id: "",
    });

    loadProducts();
    setLoading(false);
  };

  /* DELETE */
  const deleteProduct = async (id: number) => {
    if (!confirm("¿Eliminar producto?")) return;

    await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    });

    loadProducts();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        🧑‍💻 Panel Admin Productos
      </h1>

      {/* FORM */}
      <div className="bg-white p-5 rounded-xl shadow mb-8 grid gap-4">

        <input
          placeholder="Nombre"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Precio"
          value={form.price}
          onChange={(e) =>
            setForm({ ...form, price: e.target.value })
          }
          className="border p-2 rounded"
        />

        <textarea
          placeholder="Descripción"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          className="border p-2 rounded"
        />

        {/* 🧩 DRAG & DROP */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            uploadFile(e.dataTransfer.files[0]);
          }}
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition cursor-pointer"
        >
          <p className="text-gray-500 text-sm">
            Arrastra una imagen o haz click
          </p>

          <input
            type="file"
            id="fileInput"
            className="hidden"
            onChange={(e) =>
              uploadFile(e.target.files?.[0])
            }
          />

          <label
            htmlFor="fileInput"
            className="text-blue-600 text-sm mt-2 inline-block cursor-pointer"
          >
            Seleccionar archivo
          </label>

          <p className="text-xs text-gray-400 mt-1">
            JPG, PNG, WEBP (max 2MB)
          </p>

          {uploading && (
            <p className="text-xs text-gray-500 mt-2">
              Subiendo...
            </p>
          )}
        </div>

        {/* 🖼 PREVIEW */}
        {form.image && (
          <img
            src={form.image}
            className="w-28 h-28 object-cover rounded border"
          />
        )}

        <select
          value={form.category_id}
          onChange={(e) =>
            setForm({ ...form, category_id: e.target.value })
          }
          className="border p-2 rounded"
        >
          <option value="">Seleccionar categoría</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          onClick={createProduct}
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Crear producto"}
        </button>

      </div>

      {/* LISTADO */}
      <div className="grid gap-3">

        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white border rounded-xl p-3 flex justify-between items-center shadow-sm"
          >
            <div className="flex items-center gap-3">

              {p.image && (
                <img
                  src={p.image}
                  className="w-14 h-14 object-cover rounded"
                />
              )}

              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-gray-500">
                  C$ {p.price}
                </p>
              </div>

            </div>

            <button
              onClick={() => deleteProduct(p.id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Eliminar
            </button>
          </div>
        ))}

      </div>
<div className="bg-green-500 text-white p-5">
  TAILWIND OK
</div>
    </div>
  );
}