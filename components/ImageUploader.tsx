"use client";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export default function ImageUploader({
  setImageUrl,
}: {
  setImageUrl: (url: string) => void;
}) {
  return (
    <UploadButton<
      OurFileRouter,
      "imageUploader"
    >
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        const url = res?.[0]?.url;
        if (url) setImageUrl(url);
      }}
      onUploadError={(error: Error) => {
        alert("Error subiendo imagen: " + error.message);
      }}
    />
  );
}