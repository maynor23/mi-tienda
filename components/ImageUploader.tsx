"use client";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

type Props = {
  setImageUrl: (url: string) => void;
};

export default function ImageUploader({ setImageUrl }: Props) {
  return (
    <UploadButton<OurFileRouter, "imageUploader">
      endpoint="imageUploader"
      onClientUploadComplete={(res: any) => {
        const url = res?.[0]?.url;
        if (url) setImageUrl(url);
      }}
      onUploadError={(error: any) => {
        console.error("Upload error:", error);
      }}
    />
  );
}