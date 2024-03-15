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
