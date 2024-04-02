import { getSuperCategory } from "@/algo/anno";
import { DefaultAnno } from "@/algo/BIoU";
import { getCurrUserEmail } from "@/app/data";
import { MAX_ALLOWED_RECIPIENTS } from "@/constants";
import prisma from "@/prisma/client";

async function fetchUserPassedMissionIds(): Promise<string[]> {
  try {
    const userEmail = await getCurrUserEmail();
    const userMissions = await prisma.userMission.findMany({
      where: {
        email: userEmail,
        status: "PASSED",
      },
      select: {
        missionId: true,
      },
    });
    const missionIds = userMissions.map((mission) => mission.missionId);

    return missionIds;
  } catch (err) {
    console.error(err);
    throw new Error("error in fetch User Passed Missions");
  }
}

export async function fetchUserPassedDefaultAnnos() {
  try {
    const missionIds = await fetchUserPassedMissionIds();
    const imagesIds = (
      await prisma.mission.findMany({
        where: {
          id: {
            in: missionIds,
          },
        },
        select: {
          imagesIds: true,
        },
      })
    ).flatMap((mission) => mission.imagesIds);

    const defaultAnnos: DefaultAnno[] = (
      await prisma.w3CAnnotation.findMany({
        where: {
          imageId: {
            in: imagesIds,
          },
        },
        select: { defaultAnnotations: true },
      })
    )
      .flatMap((anno) => anno.defaultAnnotations as DefaultAnno)
      .filter((anno) => anno.group.length > 0);

    return defaultAnnos;
  } catch (err) {
    console.error(err);
    throw new Error("error in fetch User Passed Default Annos");
  }
}

export async function fetchUserRecommendMissions() {
  try {
    const userEmail = await getCurrUserEmail();
    const defaultAnnos = await fetchUserPassedDefaultAnnos();
    const mainCategory = getUserMainCategory(defaultAnnos);
    console.log("\nrecommend\n", mainCategory);

    const { accuracy } = (await prisma.user.findUnique({
      where: { email: userEmail },
      select: { accuracy: true },
    })) ?? { accuracy: 0.6 };

    const recommendMissions = await prisma.mission.findMany({
      where: {
        mainCategories: {
          hasSome: mainCategory,
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
        recipientsCnt: {
          lt: MAX_ALLOWED_RECIPIENTS,
        },
        reviewBySystem: accuracy > 0.8 ? {} : true,
      },
    });
    return recommendMissions;
  } catch (err) {
    console.error(err);
    throw new Error("error in fetch User Recommend Missions");
  }
}

function getUserMainCategory(defaultAnnos: DefaultAnno[]): string[] {
  const map = new Map<string, number>();
  var max = 0;
  const res = new Set<string>();

  for (const { label } of defaultAnnos) {
    const superCategory = getSuperCategory(label) ?? "";
    const cnt = map.get(superCategory) ?? 0;
    map.set(superCategory, cnt + 1);
    max = Math.max(max, cnt + 1);
  }

  for (const [label, cnt] of map) {
    if (cnt === max) {
      res.add(label);
    }
  }
  return Array.from(res);
}
