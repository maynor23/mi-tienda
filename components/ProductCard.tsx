"use client";

import { useCart } from "../context/CartContext";

export default function ProductCard({ product, onView }: any) {
  const { addToCart } = useCart();

  return (
    <div
      onClick={() => onView(product)}
      className="group cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-lg transition overflow-hidden flex flex-col h-full"
    >

      {/* 🖼️ IMAGEN */}
      <div className="w-full aspect-square bg-gray-100 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
            Sin imagen
          </div>
        )}
      </div>

      {/* INFO */}
      <div className="p-3 flex flex-col flex-grow">

        <h2 className="text-sm font-semibold line-clamp-1">
          {product.name}
        </h2>

        <p className="text-xs text-gray-500 line-clamp-2 mt-1">
          {product.description}
        </p>

        {/* 💰 PRECIO */}
        <p className="text-blue-900 font-bold mt-2">
          C$ {product.price}
        </p>

        {/* 🛒 BOTÓN */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // 🔥 evita abrir modal
            addToCart(product);
          }}
          className="mt-auto w-full bg-blue-900 text-white text-sm py-2 rounded-md hover:bg-blue-800 transition"
        >
          Agregar al carrito
        </button>

      </div>
    </div>
  );
}