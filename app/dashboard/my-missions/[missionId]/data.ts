import { getCurrUserEmail } from "@/app/data";
import prisma from "@/prisma/client";

export async function fetchUserMissionStatus(missionId: string) {
  try {
    const userEmail = await getCurrUserEmail();
    const { status } =
      (await prisma.userMission.findUnique({
        where: {
          missionId_email: {
            missionId: missionId,
            email: userEmail,
          },
        },
        select: {
          status: true,
        },
      })) ?? {};
    return status ?? null;
  } catch (err) {
    console.error(err);
    throw new Error("error in fetch user mission detail");
  }
}
