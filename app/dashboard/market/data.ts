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
    const { accuracy = 0.6 } =
      (await prisma.user.findUnique({
        where: {
          email: userEmail,
        },
        select: {
          accuracy: true,
        },
      })) ?? {};

    const totalMissions = await prisma.mission.count({
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
        publisherEmail: {
          not: userEmail,
        },
        recipientEmail: null,
        NOT: {
          multiRecipientEmails: {
            has: userEmail,
          },
        },
        OR: [
          {
            reviewBySystem: false,
            recipientEmail: accuracy > 0.8 ? null : "",
          },
          {
            reviewBySystem: true,
            recipientsCnt: {
              lt: MAX_ALLOWED_RECIPIENTS,
            },
          },
        ],
        // recipientsCnt: {
        //   lt: MAX_ALLOWED_RECIPIENTS,
        // },
        // reviewBySystem: accuracy > 0.8 ? {} : true,
        mainCategories: {
          has: category == "All" ? "_" : category,
        },
      },
    });
    console.log(totalMissions);

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
        reviewBySystem: true,
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
