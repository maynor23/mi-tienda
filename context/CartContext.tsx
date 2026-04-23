"use client";

import { createContext, useContext, useEffect, useState } from "react";

/* 🛍️ PRODUCTO BASE */
type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

/* 🛒 ITEM DEL CARRITO */
type CartItem = Product & {
  quantity: number;
};

/* 🎯 TIPO DEL CONTEXTO */
type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  increaseQty: (id: number) => void;   // 👈 NUEVO
  decreaseQty: (id: number) => void;   // 👈 NUEVO
  total: number;
};

/* 🌐 CONTEXTO */
const CartContext = createContext<CartContextType | null>(null);

/* 🚀 PROVIDER */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  /* 🔥 CARGAR DESDE LOCALSTORAGE */
  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  /* 💾 GUARDAR */
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /* ➕ AGREGAR PRODUCTO */
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find((p) => p.id === product.id);

      if (exists) {
        return prev.map((p) =>
          p.id === product.id
            ? { ...p, quantity: p.quantity + 1 }
            : p
        );
      }

      return [...prev, { ...product, quantity: 1 }];
    });
  };

  /* ➕ AUMENTAR */
  const increaseQty = (id: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  /* ➖ DISMINUIR */
  const decreaseQty = (id: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  /* ❌ ELIMINAR */
  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  /* 🧹 LIMPIAR */
  const clearCart = () => setCart([]);

  /* 💰 TOTAL */
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQty,
        decreaseQty,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* 🧠 HOOK */
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }

  return context;
}