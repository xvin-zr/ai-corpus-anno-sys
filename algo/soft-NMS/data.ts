import prisma from "@/prisma/client";
import { DefaultAnno } from "../BIoU";

export async function fetchDefaultAnnos(imageId: string) {
  try {
    const { defaultAnnotations } = ((await prisma.w3CAnnotation.findUnique({
      where: {
        imageId: imageId,
      },
      select: {
        defaultAnnotations: true,
      },
    })) ?? { defaultAnnotations: [] }) as { defaultAnnotations: DefaultAnno[] };

    return defaultAnnotations;
  } catch (err) {
    console.error(err);
    throw new Error("fetch default annos failed in soft NMS");
  }
}
