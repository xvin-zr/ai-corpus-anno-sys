"use server";
import { reviewAnnos, w3cToUserAnno } from "@/algo/anno";
import { DefaultAnno } from "@/algo/BIoU";
import { getCurrUserEmail } from "@/app/data";
import { REWARD_PERCENTAGE } from "@/constants";
import prisma from "@/prisma/client";
import { Prisma } from "@prisma/client";
import Decimal from "decimal.js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { W3CAnno } from "./data";

export async function uploadW3cAnnoAction(
  w3cAnnos: W3CAnno[],
  imageId: string,
  pixelRatio: number = 2,
) {
  try {
    const userEmail = await getCurrUserEmail();
    if (!userEmail) {
      redirect("/auth/signin");
      return;
    }

    const { accuracy = 0.6 } =
      (await prisma.user.findUnique({
        where: {
          email: userEmail,
        },
        select: {
          accuracy: true,
        },
      })) ?? {};

    const { defaultAnnotations = [] } = ((await prisma.w3CAnnotation.findUnique(
      {
        where: {
          imageId: imageId,
        },
        select: {
          defaultAnnotations: true,
        },
      },
    )) ?? {}) as { defaultAnnotations: DefaultAnno[] };

    const reviewRes = await reviewAnnos(
      defaultAnnotations ?? [],
      w3cAnnos.map((anno) => w3cToUserAnno(anno, accuracy)),
      accuracy,
      pixelRatio,
    );
    console.log("review result:", reviewRes);
    console.log(defaultAnnotations);

    const uploadedAnnos = await prisma.userAnnotation.upsert({
      where: {
        imageId_email: {
          imageId: imageId,
          email: userEmail,
        },
      },
      update: {
        w3cAnnotations: w3cAnnos as unknown as Prisma.JsonArray,
        score: accuracy,
        reviewPassed: reviewRes,
      },
      create: {
        imageId: imageId,
        email: userEmail,
        w3CAnnotationId: imageId,
        score: accuracy,
        reviewPassed: reviewRes,
        w3cAnnotations: w3cAnnos as unknown as Prisma.JsonArray,
      },
    });

    const updatedDefaultAnnos = await prisma.w3CAnnotation.update({
      where: {
        imageId: imageId,
      },
      data: {
        defaultAnnotations: defaultAnnotations,
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
  pixelRatio: number = 2,
): Promise<boolean> {
  try {
    const userEmail = await getCurrUserEmail();
    await uploadW3cAnnoAction(w3cAnnos, imageId, pixelRatio);
    await prisma.userAnnotation.deleteMany({
      where: {
        w3cAnnotations: {
          equals: [],
        },
      },
    });
    await prisma.userMission.update({
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

    const { reviewBySystem = true, reward = 0 } =
      (await prisma.mission.findUnique({
        where: {
          id: missionId,
        },
        select: {
          reviewBySystem: true,
          reward: true,
        },
      })) ?? {};

    const { imagesIds } = (await prisma.mission.findUnique({
      where: {
        id: missionId,
      },
      select: {
        imagesIds: true,
      },
    })) ?? { imagesIds: [] };

    if (reviewBySystem) {
      // TODO: 系统自动审核
      const reviewResults = await prisma.userAnnotation.findMany({
        where: {
          imageId: {
            in: imagesIds,
          },
          email: userEmail,
          NOT: {
            reviewPassed: null,
          },
        },
        select: {
          reviewPassed: true,
        },
      });
      const missionPassed = reviewResults.every((res) => res.reviewPassed);
      // 更新任务的通过和拒绝次数
      const updatedMission = await prisma.mission.update({
        where: {
          id: missionId,
        },
        data: {
          passedCnt: {
            increment: missionPassed ? 1 : 0,
          },
          rejectedCnt: {
            increment: missionPassed ? 0 : 1,
          },
        },
      });

      if (updatedMission.rejectedCnt >= 2) {
        // 任务被拒绝两次，自动升级任务
        await upgradeMission(missionId);
      }

      // 更新用户任务状态
      await prisma.userMission.update({
        where: {
          missionId_email: {
            missionId: missionId,
            email: userEmail,
          },
        },
        data: {
          status: missionPassed ? "PASSED" : "REJECTED",
        },
      });

      // 更新用户任务数量和余额
      const updatedUser = await prisma.user.update({
        where: {
          email: userEmail,
        },
        data: {
          totalMissionCnt: {
            increment: 1,
          },
          passedMissionCnt: {
            increment: missionPassed ? 1 : 0,
          },
          balance: {
            increment: missionPassed
              ? new Decimal(reward ?? 0).times(REWARD_PERCENTAGE)
              : 0,
          },
        },
      });
      // 更新用户 accuracy
      await prisma.user.update({
        where: {
          email: userEmail,
        },
        data: {
          accuracy: updatedUser.passedMissionCnt / updatedUser.totalMissionCnt,
        },
      });
    } else {
      // 由人工审核，用户标注 reviewPassed 为 null
      await prisma.userAnnotation.updateMany({
        where: {
          imageId: {
            in: imagesIds,
          },
          email: userEmail,
        },
        data: {
          reviewPassed: null,
        },
      });
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

async function upgradeMission(missionId: string) {
  try {
    await prisma.mission.update({
      where: {
        id: missionId,
      },
      data: {
        status: "PENDING_ACCEPT",
        reviewBySystem: false,
      },
    });
  } catch (err) {
    console.error(err);
    throw new Error("error in upgrade mission");
  }
}

/*
 * 审核单张图片
 */
async function reviewSingleImage(imageId: string) {
  const { defaultAnnotations, userAnnotations } =
    await fetchDefaultAndUserAnnotations(imageId);
}

async function fetchDefaultAndUserAnnotations(imageId: string) {
  try {
    const userEmail = await getCurrUserEmail();

    const { defaultAnnotations = [] } =
      (await prisma.w3CAnnotation.findUnique({
        where: {
          imageId: imageId,
        },
        select: {
          defaultAnnotations: true,
        },
      })) ?? {};

    const { w3cAnnotations: userAnnotations = [] } =
      (await prisma.userAnnotation.findUnique({
        where: {
          imageId_email: {
            imageId: imageId,
            email: userEmail,
          },
        },
        select: {
          w3cAnnotations: true,
        },
      })) ?? {};
    return {
      defaultAnnotations,
      userAnnotations,
    };
  } catch (err) {
    console.error(err);
    throw new Error("error in review single image");
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
