import { authOptions } from "@/app/api/auth/[...nextauth]/auth-option";
import prisma from "@/prisma/client";
import { Prisma } from "@prisma/client";
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
          publisherEmail: userEmail,
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

export async function fetchReviewAnnos(missionId: string, imageId: string) {
  // 通过 missionId 拿到 recipientEmail
  // 通过 recipientEmail 和 imageId 拿到 reviewAnnos
  try {
    const { recipientEmail } =
      (await prisma.mission.findUnique({
        where: {
          id: missionId,
        },
        select: {
          recipientEmail: true,
        },
      })) ?? {};
    if (!recipientEmail) {
      throw new Error("recipientEmail not found in reviewing");
    }

    const { w3cAnnotations = [] } =
      (await prisma.userAnnotation.findUnique({
        where: {
          imageId_email: {
            imageId,
            email: recipientEmail,
          },
        },
        select: {
          w3cAnnotations: true,
        },
      })) ?? {};
    return w3cAnnotations as Prisma.JsonArray;
  } catch (err) {
    console.error(err);
    throw new Error("error in fetch review annos");
  }
}
