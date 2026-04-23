"use client";

import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cart, total, removeFromCart, clearCart } = useCart();

  return (
    <div className="max-w-3xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-4">
        🛒 Tu carrito
      </h1>

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex justify-between border p-3 mb-2"
        >
          <div>
            <p className="font-bold">{item.name}</p>
            <p>Cantidad: {item.quantity}</p>
            <p>C$ {item.price}</p>
          </div>

          <button
            onClick={() => removeFromCart(item.id)}
            className="text-red-500"
          >
            Eliminar
          </button>
        </div>
      ))}

      <h2 className="text-xl font-bold mt-4">
        Total: C$ {total}
      </h2>

      <button
        onClick={clearCart}
        className="mt-4 bg-black text-white px-4 py-2"
      >
        Vaciar carrito
      </button>
    </div>
  );
}