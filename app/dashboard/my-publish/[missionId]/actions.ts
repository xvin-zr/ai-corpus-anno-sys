"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth-option";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export async function deleteMissionAction(
  missionId: string,
): Promise<{ success: boolean; msg: string }> {
  console.log("missionId:", missionId);
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return {
      success: false,
      msg: "删除失败，用户未登录",
    };
  }

  try {
    const mission = await prisma.mission.findUnique({
      where: {
        id: missionId,
      },
      select: {
        publisherEmail: true,
      },
    });
    if (!mission?.publisherEmail) {
      return {
        success: false,
        msg: "删除失败，任务不存在",
      };
    } else if (userEmail != mission.publisherEmail) {
      return {
        success: false,
        msg: "删除失败，您不是该任务的发布者",
      };
    }

    // TODO: 删除任务逻辑
    const deletedMission = await prisma.mission.delete({
      where: {
        id: missionId,
        publisherEmail: userEmail,
      },
    });

    revalidatePath("/dashboard/my-publish");

    return {
      success: true,
      msg: "删除成功",
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      msg: "删除失败",
    };
  }
}
