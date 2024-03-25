"use server";

import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";

export async function passReviewAction(missionId: string): Promise<{
  success: boolean;
  msg: string;
}> {
  try {
    const updatedMission = await prisma.mission.update({
      where: {
        id: missionId,
      },
      data: {
        status: "COMPLETED",
        comment: null,
      },
    });

    const updatedUserMission = await prisma.userMission.update({
      where: {
        missionId_email: {
          missionId: missionId,
          email: updatedMission?.recipientEmail ?? "",
        },
      },
      data: {
        status: "COMPLETED",
      },
    });

    if (!updatedMission || !updatedUserMission) {
      return {
        success: false,
        msg: "通过审核出错，请稍后再试",
      };
    }

    const { recipientEmail, reward } = updatedMission;

    const updatedUser = await prisma.user.update({
      where: {
        email: recipientEmail ?? undefined,
      },
      data: {
        balance: {
          increment: reward ?? 0,
        },
      },
    });

    if (!updatedUser) {
      return {
        success: false,
        msg: "通过审核出错，请稍后再试",
      };
    }
    revalidatePath(`/dashboard/my-publish/${missionId}`);
    revalidatePath(`/dashboard/my-publish`);
    return {
      success: true,
      msg: "通过审核成功",
    };
  } catch (err) {
    console.error(err);
    throw new Error("Failed to pass review");
  }
}

export async function addImproveCommentAction(
  missionId: string,
  comment: string,
): Promise<{ success: boolean; msg: string }> {
  try {
    const updatedMission = await prisma.mission.update({
      where: {
        id: missionId,
      },
      data: {
        status: "PENDING_IMPROVE",
        comment: comment,
      },
    });

    const updatedUserMission = await prisma.userMission.update({
      where: {
        missionId_email: {
          missionId: missionId,
          email: updatedMission?.recipientEmail ?? "",
        },
      },
      data: {
        status: "PENDING_IMPROVE",
      },
    });

    if (!updatedMission || !updatedUserMission) {
      return {
        success: false,
        msg: "发布失败，请稍后再试",
      };
    }

    revalidatePath(`/dashboard/my-publish/${missionId}`);
    revalidatePath(`/dashboard/my-publish`);
    return {
      success: true,
      msg: "发布成功，过段时间再来审核吧",
    };
  } catch (err) {
    console.error(err);
    throw new Error("Failed to add improve comment");
  }
}
