"use client";

import { useState } from "react";

export default function ProductGalleryPro({
  images,
}: {
  images: string[];
}) {
  const [selected, setSelected] = useState(images[0]);
  const [zoomStyle, setZoomStyle] = useState({});

  const handleMove = (e: any) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
  };

  const handleLeave = () => {
    setZoomStyle({
      transform: "scale(1)",
      transformOrigin: "center",
    });
  };

  return (
    <div>

      {/* 🖼️ UNA SOLA IMAGEN CON ZOOM */}
      <div
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="w-full h-72 bg-gray-100 rounded-lg overflow-hidden cursor-zoom-in"
      >
        <img
          src={selected}
          className="w-full h-full object-cover transition duration-200"
          style={zoomStyle}
        />
      </div>

      {/* 🧩 MINIATURAS */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-3">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              onMouseEnter={() => setSelected(img)}
              className={`w-14 h-14 object-cover rounded cursor-pointer border ${
                selected === img
                  ? "border-blue-900"
                  : "border-gray-200"
              }`}
            />
          ))}
        </div>
      )}

    </div>
  );
}