import { getCurrUserEmail } from "@/app/data";
import { MAX_ALLOWED_RECIPIENTS, SuperCategory } from "@/constants";
import prisma from "@/prisma/client";

export const MISSION_PAGE_SIZE = 8;

export async function fetchMissionPages(
  query: string,
  category: SuperCategory | "All",
): Promise<number> {
  const userEmail = await getCurrUserEmail();
  try {
    const totalMissions = await prisma.mission.count({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
        status: "PENDING_ACCEPT",
        recipientEmail: null,
        recipientsCnt: {
          lt: MAX_ALLOWED_RECIPIENTS,
        },
        NOT: {
          multiRecipientEmails: {
            has: userEmail,
          },
          publisherEmail: userEmail,
        },
        mainCategories: {
          has: category == "All" ? "_" : category,
        },
      },
    });

    return Math.ceil(totalMissions / MISSION_PAGE_SIZE);
  } catch (err) {
    console.error(err);
    return NaN;
  }
}

export async function fetchMissionDetail(missionId: string) {
  try {
    const mission = await prisma.mission.findUnique({
      where: {
        id: missionId,
      },
      select: {
        title: true,
        createdAt: true,
        updatedAt: true,
        description: true,
        comment: true,
        reward: true,
        publisherEmail: true,
        status: true,
        insFileName: true,
        multiRecipientEmails: true,
        reviewerEmail: true,
        passedCnt: true,
        images: {
          select: {
            url: true,
          },
        },
      },
    });

    return mission;
  } catch (err) {
    console.error(err);
    return null;
  }
}
