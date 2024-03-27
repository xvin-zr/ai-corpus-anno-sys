import { DefaultAnno } from "@/algo/BIoU";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-option";
import { getCurrUserEmail } from "@/app/data";
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
          OR: [
            { recipientEmail: userEmail },
            { multiRecipientEmails: { has: userEmail } },
          ],
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

export async function fetchW3cAnnos(imageId: string) {
  try {
    const userEmail = await getCurrUserEmail();

    const w3cAnnos = await prisma.userAnnotation.findUnique({
      where: {
        imageId_email: {
          email: userEmail,
          imageId: imageId,
        },
      },
      select: {
        w3cAnnotations: true,
      },
    });
    if (!w3cAnnos) {
      return [];
    }
    return w3cAnnos.w3cAnnotations as Prisma.JsonArray;
  } catch (err) {
    console.error(err);
    throw new Error("error in fetch w3c annotations");
  }
}

export interface W3CAnno {
  id: string;
  body: {
    type: "TextualBody";
    purpose: "tagging" | "commenting";
    value: string;
  }[];
  target: {
    selector: {
      type: "FragmentSelector";
      value: string;
    };
  };
}

export async function fetchDefaultAnnosLen(imageId: string) {
  try {
    const { defaultAnnotations = [] } =
      (await prisma.w3CAnnotation.findUnique({
        where: {
          imageId: imageId,
        },
        select: {
          defaultAnnotations: true,
        },
      })) ?? {};
    return Math.max((defaultAnnotations as DefaultAnno[]).length - 1, 1);
  } catch (err) {
    console.error(err);
    throw new Error("error in fetch default annotations");
  }
}

function w3cAnnoToBox(w3cAnnos: W3CAnno[]) {
  return w3cAnnos.map(function (anno) {
    const { x, y, width, height } = JSON.parse(anno.target.selector.value);
    return {
      x,
      y,
      width,
      height,
      id: anno.id,
    };
  });
}
