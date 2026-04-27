"use client";

import { useEffect, useState } from "react";
import ImageUploader from "@/components/ImageUploader";

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category_id: number;
  category?: {
    id: number;
    name: string;
  };
};

type Category = {
  id: number;
  name: string;
};

type FormState = {
  name: string;
  price: string;
  description: string;
  image: string;
  category_id: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<FormState>({
    name: "",
    price: "",
    description: "",
    image: "",
    category_id: "",
  });

  /* 📦 LOAD DATA */
  const loadProducts = async () => {
    const res = await fetch("/api/admin/products");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  };

  const loadCategories = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setCategories(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  /* 💾 SAVE */
  const saveProduct = async () => {
    console.log("FORM ANTES DE GUARDAR:", form); // 🔥 DEBUG

    if (!form.name || !form.price || !form.category_id) {
      alert("Completa los campos");
      return;
    }

    // 🔥 VALIDAR IMAGEN
    if (!form.image) {
      alert("Debes subir una imagen primero");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        category_id: Number(form.category_id),
      };

      console.log("PAYLOAD ENVIADO:", payload); // 🔥 DEBUG

      const url = editingId
        ? `/api/admin/products/${editingId}`
        : "/api/admin/products";

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("RESPUESTA BACKEND:", data); // 🔥 DEBUG

      resetForm();
      loadProducts();
    } catch (error) {
      console.error(error);
      alert("Error guardando producto");
    } finally {
      setLoading(false);
    }
  };

  /* 🗑️ DELETE */
  const deleteProduct = async (id: number) => {
    await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    });

    loadProducts();
  };

  /* ✏️ EDIT */
  const editProduct = (product: Product) => {
    setForm({
      name: product.name,
      price: product.price.toString(),
      description: product.description || "",
      image: product.image || "",
      category_id: product.category_id.toString(),
    });

    setEditingId(product.id);
    setShowModal(true);
  };

  /* 🔄 RESET */
  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      description: "",
      image: "",
      category_id: "",
    });
    setEditingId(null);
    setShowModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        🧑‍💻 Panel Admin - Productos
      </h1>

      {/* BOTÓN NUEVO */}
      <button
        onClick={() => {
          resetForm();
          setShowModal(true);
        }}
        className="bg-blue-900 text-white py-2 px-4 rounded mb-6"
      >
        ➕ Registrar producto
      </button>

      {/* LISTA */}
      <div className="grid gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex justify-between items-center bg-white p-4 rounded-xl shadow"
          >
            <div className="flex items-center gap-4">
              {p.image ? (
                <img
                  src={p.image}
                  className="w-14 h-14 object-cover rounded"
                />
              ) : (
                <div className="w-14 h-14 bg-gray-200 rounded flex items-center justify-center text-xs">
                  Sin img
                </div>
              )}

              <div>
                <p className="font-bold">{p.name}</p>
                <p className="text-sm text-gray-500">C$ {p.price}</p>
                <p className="text-xs text-gray-400">
                  {p.category?.name}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => editProduct(p)}
                className="bg-yellow-400 text-white px-3 py-1 rounded"
              >
                Editar
              </button>

              <button
                onClick={() => deleteProduct(p.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <>
          <div
            onClick={resetForm}
            className="fixed inset-0 bg-black/50 z-40"
          />

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-xl p-6">

              <h2 className="text-xl font-bold mb-4">
                {editingId ? "✏️ Editar producto" : "➕ Nuevo producto"}
              </h2>

              <div className="space-y-3">

                <input
                  className="border p-2 rounded w-full"
                  placeholder="Nombre"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />

                <input
                  className="border p-2 rounded w-full"
                  type="number"
                  placeholder="Precio"
                  value={form.price}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, price: e.target.value }))
                  }
                />

                <textarea
                  className="border p-2 rounded w-full"
                  placeholder="Descripción"
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />

                {/* 🔥 UPLOADTHING */}
                <ImageUploader
                  setImageUrl={(url) =>
                    setForm((prev) => ({
                      ...prev,
                      image: url,
                    }))
                  }
                />

                {/* 🔥 PREVIEW */}
                {form.image && (
                  <img
                    src={form.image}
                    className="w-24 h-24 object-cover rounded mt-2 border"
                  />
                )}

                <select
                  className="border p-2 rounded w-full"
                  value={form.category_id}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      category_id: e.target.value,
                    }))
                  }
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>

              </div>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={resetForm}
                  className="w-full bg-gray-200 py-2 rounded"
                >
                  Cancelar
                </button>

                <button
                  onClick={saveProduct}
                  disabled={loading}
                  className="w-full bg-blue-900 text-white py-2 rounded"
                >
                  {loading
                    ? "Guardando..."
                    : editingId
                    ? "Actualizar"
                    : "Guardar"}
                </button>
              </div>

            </div>
          </div>
        </>
      )}

    </div>
  );
}