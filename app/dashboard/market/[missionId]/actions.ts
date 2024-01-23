"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/auth-option";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface AcceptMissionState {
  success: boolean;
  msg: string;
}

export async function acceptMission(
  missionId: string,
  prevState: AcceptMissionState,
  formData: FormData,
): Promise<AcceptMissionState> {
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
      },
    });
    console.log(mission);
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

    // const acceptedMission = await prisma.mission.update({
    //   where: {
    //     id: missionId,
    //   },
    //   data: {
    //     status: "ONGOING",
    //     recipientEmail: userEmail,
    //   },
    // });
    // if (!acceptedMission) {
    //   return {
    //     success: false,
    //     msg: "接受失败，请稍后再试",
    //   };
    // }

    return {
      success: true,
      msg: "接受成功",
    };
  } catch (err) {
    console.error(err);
    return { success: false, msg: "接受失败，请稍后再试" };
  }
}
