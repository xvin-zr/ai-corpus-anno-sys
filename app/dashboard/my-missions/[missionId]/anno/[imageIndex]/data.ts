import { authOptions } from "@/app/api/auth/[...nextauth]/auth-option";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { cache } from "react";

export const fetchImagesIds = cache(async function fetchImagesIds(
  missionId: string,
): Promise<string[]> {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    redirect("/auth/signin");
  }

  try {
    const imagesIds = (
      await prisma.mission.findUnique({
        where: {
          id: missionId,
          recipientEmail: userEmail,
        },
        select: {
          imagesIds: true,
        },
      })
    )?.imagesIds;
    return imagesIds ?? [];
  } catch (err) {
    console.error(err);
    throw new Error("error in fetch images ids");
  }
});

export async function fetchImageInfo(
  imageId: string,
): Promise<{ url: string; width: number; height: number }> {
  try {
    const image = await prisma.image.findUnique({
      where: {
        id: imageId,
      },
      select: {
        url: true,
        width: true,
        height: true,
      },
    });
    if (!image) {
      throw new Error("image not found");
    }
    return {
      url: image.url,
      width: image.width ?? 0,
      height: image.height ?? 0,
    };
  } catch (err) {
    console.error(err);
    throw new Error("error in fetch image info");
  }
}
