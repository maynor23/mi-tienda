"use client";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export default function ImageUploader({ onUpload }: { onUpload: (url: string) => void }) {
  return (
    <UploadButton<OurFileRouter, "productImage">
      endpoint="productImage"
      onClientUploadComplete={(res) => {
        if (res && res[0]) {
          const imageUrl = res[0].url;
          console.log("Imagen subida:", imageUrl);
          onUpload(imageUrl); // Pasamos el URL al padre
        }
      }}
      onUploadError={(error) => {
        alert(`Error: ${error.message}`);
      }}
    />
  );
}
