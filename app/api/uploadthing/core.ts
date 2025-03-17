import User from "@/app/models/User";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

const f = createUploadthing();

const auth = async (req: Request) => {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return { error: "Não autorizado" };
  }
  return {
    id: session.user._id,
    email: session.user.email,
    image: session.user.image,
  };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);

      // If you throw, the user will not be able to upload
      if (!user || user.error) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id, userEmail: user.email, userImage: user.image };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      await connectToDatabase();
      const user = await User.findOne(
        {
          email: metadata.userEmail,
        },
      );
      if (!user) {
        return
      }
      const oldImageKey = user.imageKey;
      user.image = file.ufsUrl;
      user.imageKey = file.key;
      user.save();
      if (oldImageKey) {
        try {
          const utapi = new UTApi();
          await utapi.deleteFiles(oldImageKey);
        } catch (e) {
          console.error(e);
        }
      }
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId, imageUrl: file.ufsUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
