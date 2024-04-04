"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth-option";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function acceptMissionAction(missionId: string): Promise<{
  success: boolean;
  msg: string;
}> {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email)
    redirect("/auth/signin");
  const userEmail = session.user.email;

  try {
    const mission = await prisma.mission.findUnique({
      where: {
        id: missionId,
      },
      select: {
        publisherEmail: true,
        reviewBySystem: true,
      },
    });
    if (!mission || !mission.publisherEmail) {
      return {
        success: false,
        msg: "任务或发布者不存在",
      };
    } else if (mission.publisherEmail == userEmail) {
      return {
        success: false,
        msg: "无法接受自己发布的任务",
      };
    }

    const updatedMission = await prisma.mission.update({
      where: {
        id: missionId,
        publisherEmail: {
          not: userEmail,
        },
        recipientEmail: null,
        NOT: {
          multiRecipientEmails: {
            has: userEmail,
          },
        },
      },
      data: mission.reviewBySystem
        ? {
            status: "ONGOING",
            multiRecipientEmails: {
              push: userEmail,
            },
            recipientsCnt: {
              increment: 1,
            },
          }
        : {
            status: "ONGOING",
            recipientEmail: userEmail,
          },
    });

    const createdUserMission = await prisma.userMission.upsert({
      where: {
        missionId_email: {
          missionId: missionId,
          email: userEmail,
        },
      },
      update: {
        status: "ONGOING",
      },
      create: {
        missionId: missionId,
        email: userEmail,
        status: "ONGOING",
      },
    });
    if (!updatedMission || !createdUserMission) {
      return {
        success: false,
        msg: "接受失败，请稍后再试",
      };
    }

    revalidatePath("/dashboard/market");
    revalidatePath("/dashboard/my-missions");
    return {
      success: true,
      msg: "测试通过，任务接受成功",
    };
  } catch (err) {
    console.error(err);
    return { success: false, msg: "接受失败，请稍后再试" };
  }
}
