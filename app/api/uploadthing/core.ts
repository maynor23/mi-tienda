import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1, // 🔥 evita múltiples archivos
    },
  })
    .middleware(async () => {
      // aquí podrías validar usuario en el futuro
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      console.log("✅ Uploaded file:", file.url);

      // 🔥 opcional: puedes devolver datos al frontend
      return {
        url: file.url,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;