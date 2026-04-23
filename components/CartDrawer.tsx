"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";
import CheckoutModal from "./CheckoutModal";

export default function CartDrawer({
  closeCart,
}: {
  closeCart: () => void;
}) {
  const {
    cart,
    removeFromCart,
    total,
    clearCart,
    increaseQty,
    decreaseQty,
  } = useCart();

  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <div className="h-full flex flex-col bg-white w-[350px] fixed right-0 top-0 z-50 shadow-xl">

      {/* HEADER */}
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-bold">🛒 Tu carrito</h2>

        <button
          onClick={closeCart}
          className="text-gray-500 hover:text-black text-lg"
        >
          ✕
        </button>
      </div>

      {/* PRODUCTOS */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {cart.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            Tu carrito está vacío
          </p>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 bg-gray-50 p-3 rounded-xl border"
            >

              {/* 🖼️ IMAGEN */}
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">
                  Sin imagen
                </div>
              )}

              {/* INFO */}
              <div className="flex-1">
                <h3 className="text-sm font-semibold">
                  {item.name}
                </h3>

                {/* 🔢 CONTROLES DE CANTIDAD */}
                <div className="flex items-center gap-2 mt-2">

                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="px-2 bg-gray-200 rounded"
                  >
                    -
                  </button>

                  <span className="text-sm font-bold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => increaseQty(item.id)}
                    className="px-2 bg-gray-200 rounded"
                  >
                    +
                  </button>

                </div>

                <p className="text-sm font-bold text-blue-900 mt-1">
                  C$ {item.price * item.quantity}
                </p>
              </div>

              {/* ❌ ELIMINAR */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 text-sm"
              >
                ✕
              </button>
            </div>
          ))
        )}

      </div>

      {/* FOOTER */}
      <div className="border-t p-4 space-y-3">

        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>C$ {total}</span>
        </div>

        <button
          onClick={clearCart}
          className="w-full bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
        >
          Vaciar carrito
        </button>

        <button
          onClick={() => setCheckoutOpen(true)}
          className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800"
        >
          Proceder al pago
        </button>

      </div>

      {/* 🔥 MODAL CHECKOUT */}
      {checkoutOpen && (
        <CheckoutModal close={() => setCheckoutOpen(false)} />
      )}

    </div>
  );
}