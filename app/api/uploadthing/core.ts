import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(() => ({}))
    .onUploadComplete(({ file }) => {
      console.log("Uploaded:", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;