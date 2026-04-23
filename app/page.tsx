"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import ProductGalleryPro from "../components/ProductGalleryPro";

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

export default function Home() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<number | "all">("all");

  /* 📦 LOAD PRODUCTS */
  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) =>
        setProducts(Array.isArray(data) ? data : [])
      );
  }, []);

  /* 📂 LOAD CATEGORIES */
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) =>
        setCategories(Array.isArray(data) ? data : [])
      );
  }, []);

  /* 🔍 FILTER */
  const filtered = products.filter((p) => {
    return (
      (selectedCategory === "all" ||
        p.category_id === selectedCategory) &&
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      {/* 🔥 BANNER */}
      <div className="w-full flex justify-center mt-2 px-4">
      <div className="w-full max-w-7xl aspect-[6/1] rounded-xl overflow-hidden shadow">
          <img
            src="/p5.jpg"
            alt="banner"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">

        {/* 🔍 BUSCADOR */}
        <div className="flex justify-center mt-4">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full max-w-xl border rounded-full px-5 py-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-900"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* 🧩 CATEGORÍAS */}
        <div className="flex gap-2 justify-center mt-4 flex-wrap">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1 rounded-full text-sm border ${
              selectedCategory === "all"
                ? "bg-blue-900 text-white"
                : "bg-white"
            }`}
          >
            Todos
          </button>

          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1 rounded-full text-sm border ${
                selectedCategory === c.id
                  ? "bg-blue-900 text-white"
                  : "bg-white"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* 🛍️ GRID PRODUCTOS */}
        <div className="mt-6 pb-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onView={setSelectedProduct}
            />
          ))}
        </div>

        {/* ❌ SIN RESULTADOS */}
        {filtered.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No se encontraron productos
          </p>
        )}
      </div>

      {/* 🔥 MODAL PRODUCTO PRO */}
      {selectedProduct && (
        <>
          {/* OVERLAY */}
          <div
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* MODAL */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full p-5 relative shadow-xl animate-fadeIn">

              {/* CERRAR */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-3 text-gray-500 hover:text-black text-lg"
              >
                ✕
              </button>

              <div className="grid md:grid-cols-2 gap-6">

                {/* 🖼️ GALERÍA PRO */}
                <ProductGalleryPro
  images={[selectedProduct.image || "/placeholder.png"]}
/>

                {/* 📄 INFO */}
                <div className="flex flex-col">

                  <h2 className="text-xl font-bold mb-2">
                    {selectedProduct.name}
                  </h2>

                  <p className="text-gray-600 mb-4 text-sm">
                    {selectedProduct.description}
                  </p>

                  <p className="text-blue-900 font-bold text-2xl mb-4">
                    C$ {selectedProduct.price}
                  </p>

                  <button
                    onClick={() => addToCart(selectedProduct)}
                    className="mt-auto bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition"
                  >
                    🛒 Agregar al carrito
                  </button>

                </div>

              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}