"use server";
import prisma from "@/prisma/client";
import { Prisma } from "@prisma/client";
import { W3CAnno } from "./data";
import { revalidatePath } from "next/cache";
import { getCurrUserEmail } from "@/app/data";
import { redirect } from "next/navigation";

export async function uploadW3cAnnoAction(
  w3cAnnos: W3CAnno[],
  imageId: string,
) {
  try {
    const userEmail = await getCurrUserEmail();
    if (!userEmail) {
      redirect("/auth/signin");
      return;
    }

    const uploadedAnnos = await prisma.userAnnotation.upsert({
      where: {
        imageId_email: {
          imageId: imageId,
          email: userEmail,
        },
      },
      update: {
        w3cAnnotations: w3cAnnos as unknown as Prisma.JsonArray,
      },
      create: {
        imageId: imageId,
        email: userEmail,
        w3CAnnotationId: imageId,
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
    const userEmail = await getCurrUserEmail();
    await uploadW3cAnnoAction(w3cAnnos, imageId);
    await prisma.userAnnotation.deleteMany({
      where: {
        w3cAnnotations: {
          equals: [],
        },
      },
    });
    const updatedMission = await prisma.userMission.update({
      where: {
        missionId_email: {
          missionId: missionId,
          email: userEmail,
        },
      },
      data: {
        status: "PENDING_REVIEW",
      },
    });
    if (!updatedMission) {
      throw new Error("mission not found");
    }

    const { reviewBySystem = true } =
      (await prisma.mission.findUnique({
        where: {
          id: missionId,
        },
        select: {
          reviewBySystem: true,
        },
      })) ?? {};

    if (reviewBySystem) {
      // TODO: 系统自动审核
    } else {
      // 除了用户的任务状态外，更新任务状态
      await prisma.mission.update({
        where: {
          id: missionId,
        },
        data: {
          status: "PENDING_REVIEW",
        },
      });
    }
    revalidatePath(`/dashboard/my-missions/${missionId}`);
    revalidatePath(`/dashboard/my-missions`);
    return true;
  } catch (err) {
    console.error(err);
    throw new Error("error in complete mission");
  }
}

async function reviewAnnotations(missionId: string) {
  try {
    const { imagesIds } =
      (await prisma.mission.findUnique({
        where: {
          id: missionId,
        },
        select: {
          imagesIds: true,
        },
      })) ?? {};

    if (!imagesIds) {
      throw new Error("images not found");
    }

    const w3cAnnos = await prisma.w3CAnnotation.findMany({
      where: {
        imageId: {
          in: imagesIds,
        },
      },
      select: {
        imageId: true,
        defaultAnnotations: true,
        userAnnotations: {
          select: {
            w3cAnnotations: true,
          },
        },
      },
    });
    // TODO：对比 w3cAnnos 和 defaultAnnotations，生成 review 结果
  } catch (err) {
    console.error(err);
    throw new Error("error in review annotations");
  }
}
