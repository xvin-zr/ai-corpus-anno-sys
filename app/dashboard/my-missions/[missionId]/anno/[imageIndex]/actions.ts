"use server";
import prisma from "@/prisma/client";
import { Prisma } from "@prisma/client";
import { W3CAnno } from "./data";

export async function uploadW3cAnnoAction(
  w3cAnnos: W3CAnno[],
  imageId: string,
) {
  try {
    const uploadedAnnos = await prisma.w3CAnnotation.upsert({
      where: {
        imageId: imageId,
      },
      update: {
        w3cAnnotations: w3cAnnos as unknown as Prisma.JsonArray,
      },
      create: {
        id: imageId,
        imageId: imageId,
        w3cAnnotations: w3cAnnos as unknown as Prisma.JsonArray,
      },
    });
    console.log("uploaded annos:", uploadedAnnos);
  } catch (err) {
    console.error(err);
    throw new Error("error in upload w3c annotations");
  }
}

export async function completeMissionAction(
  w3cAnnos: W3CAnno[],
  imageId: string,
  missionId: string,
): Promise<boolean> {
  try {
    await uploadW3cAnnoAction(w3cAnnos, imageId);
    await prisma.w3CAnnotation.deleteMany({
      where: {
        w3cAnnotations: {
          equals: [],
        },
      },
    });
    const updatedMission = await prisma.mission.update({
      where: {
        id: missionId,
      },
      data: {
        status: "PENDING_REVIEW",
      },
    });
    if (!updatedMission) {
      throw new Error("mission not found");
    }
    return true;
  } catch (err) {
    console.error(err);
    throw new Error("error in complete mission");
  }
}
