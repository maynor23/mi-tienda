"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";
import ImageUploader from "@/components/ImageUploader";

export default function CheckoutModal({ close }: any) {
  const { cart, total, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.address) {
      setError("Completa todos los campos");
      return;
    }

    const phoneRegex = /^[0-9]{8}$/;
    if (!phoneRegex.test(form.phone)) {
      setError("Número de teléfono inválido");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cliente: form,
          productos: cart,
          total,
        }),
      });

      if (!response.ok) throw new Error("Error al procesar pedido");

      const order = await response.json();

      const fecha = new Date().toLocaleDateString("es-NI");

      const mensaje = encodeURIComponent(`
🧾 NUEVO PEDIDO #${order.id}
📅 Fecha: ${fecha}
👤 Cliente: ${order.name}
📱 Tel: ${order.phone}
📍 Dirección: ${order.address}

🛒 PRODUCTOS:
${order.items
  .map(
    (i: any) =>
      `- ${i.name} x${i.quantity}...... C$ ${i.price * i.quantity}`
  )
  .join("\n")}

💰 Sub Total: C$ ${order.total}
📦 Envío: pendiente
      `);

      window.location.href = `https://wa.me/50577632589?text=${mensaje}`;

      clearCart();
      close();
    } catch (err) {
      console.error(err);
      setError("Hubo un problema al realizar el pedido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* OVERLAY */}
      <div onClick={close} className="fixed inset-0 bg-black/50 z-50" />

      {/* MODAL */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 animate-fadeIn">
          <h2 className="text-xl font-bold mb-4">🧾 Finalizar compra</h2>

          {/* FORM */}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nombre completo"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border p-3 rounded-lg"
            />

            <input
              type="tel"
              placeholder="Número de teléfono"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border p-3 rounded-lg"
            />

            <textarea
              placeholder="Dirección de envío"
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
              className="w-full border p-3 rounded-lg"
            />

            {/* 🔥 UPLOAD IMAGEN (OPCIONAL) */}
            <ImageUploader
              setImageUrl={(url) =>
                setForm({ ...form, image: url })
              }
            />

            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>

          {/* TOTAL */}
          <div className="mt-4 flex justify-between font-bold">
            <span>Total:</span>
            <span>C$ {total}</span>
          </div>

          {/* BOTONES */}
          <div className="mt-5 flex gap-2">
            <button
              onClick={close}
              className="w-full bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancelar
            </button>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-2 rounded-lg ${
                loading
                  ? "bg-gray-400 text-white"
                  : "bg-blue-900 text-white hover:bg-blue-800"
              }`}
            >
              {loading ? "Procesando..." : "Confirmar"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
