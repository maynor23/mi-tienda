"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const { cart } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* 🔥 NAVBAR FIJO */}
      <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

          {/* 🟦 LOGO */}
          <div className="text-lg font-bold text-blue-900">
            MiTienda
          </div>

          {/* 🔍 SEARCH CENTRAL (ESTILO AMAZON SIMPLE) */}
          <div className="hidden md:flex flex-1 mx-6">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full border rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-900"
            />
          </div>

          {/* 🛒 CARRITO */}
          <button
            id="cart-icon"
            onClick={() => setOpen(true)}
            className="relative flex items-center justify-center w-11 h-11 rounded-full border bg-white hover:bg-gray-100 transition shadow-sm"
          >
            <span className="text-xl">🛒</span>

            {cart.length > 0 && (
              <span className="
                absolute 
                -top-1 
                -right-1 
                bg-blue-900 
                text-white 
                text-[11px] 
                font-bold 
                px-1.5 
                py-[1px] 
                rounded-full 
                shadow
              ">
                {cart.length}
              </span>
            )}
          </button>

        </div>
      </nav>

      {/* 🛒 CART DRAWER */}
      {open && (
        <>
          {/* OVERLAY */}
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* PANEL */}
          <div className="fixed right-0 top-0 h-full w-[360px] bg-white shadow-2xl z-50 animate-slideIn">
            <CartDrawer closeCart={() => setOpen(false)} />
          </div>
        </>
      )}
    </>
  );
}