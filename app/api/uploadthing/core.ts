import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const fileRouter = {
  productImage: f({ image: { maxFileSize: "4MB" } })
    .onUploadComplete(async ({ file }) => {
      console.log("Archivo subido:", file.url);
      // Aquí podrías guardar el URL en tu base de datos
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof fileRouter;
