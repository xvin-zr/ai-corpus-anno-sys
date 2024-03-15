"use server";

import prisma from "@/prisma/client";

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

    if (!updatedMission) {
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

    if (!updatedMission) {
      return {
        success: false,
        msg: "发布失败，请稍后再试",
      };
    }

    return {
      success: true,
      msg: "发布成功，过段时间再来审核吧",
    };
  } catch (err) {
    console.error(err);
    throw new Error("Failed to add improve comment");
  }
}
