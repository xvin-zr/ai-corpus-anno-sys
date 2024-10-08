import { getSuperCategory } from "@/algo/anno";
import { DefaultAnno } from "@/algo/BIoU";
import { getCurrUserEmail } from "@/app/data";
import { MAX_ALLOWED_RECIPIENTS } from "@/constants";
import prisma from "@/prisma/client";

async function fetchUserPassedMissionIds(): Promise<string[]> {
  const userEmail = await getCurrUserEmail();
  try {
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
    const imagesIds = await prisma.mission.findMany({
      where: {
        id: {
          in: missionIds,
        },
      },
      select: {
        imagesIds: true,
        updatedAt: true,
      },
    });
    // .flatMap((mission) => mission.imagesIds);

    const defaultAnnos: { anno: DefaultAnno[]; updatedAt: Date }[] = (
      await prisma.w3CAnnotation.findMany({
        where: {
          imageId: {
            in: imagesIds.flatMap((image) => image.imagesIds),
          },
        },
        select: { defaultAnnotations: true, imageId: true },
      })
    ).flatMap((anno) => {
      return {
        anno: anno.defaultAnnotations as DefaultAnno[],
        updatedAt:
          imagesIds.find(({ imagesIds }) => imagesIds.includes(anno.imageId))
            ?.updatedAt ?? new Date(),
      };
    });

    return defaultAnnos;
  } catch (err) {
    console.error(err);
    throw new Error("error in fetch User Passed Default Annos");
  }
}

export async function fetchUserRecommendMissions() {
  const userEmail = await getCurrUserEmail();
  try {
    const defaultAnnos = await fetchUserPassedDefaultAnnos();
    const notInterestedLabels = await fetchUserNotInterestedLabels();
    const mainCategory = getUserMainCategory(defaultAnnos, notInterestedLabels);
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
      orderBy: {
        createdAt: "desc",
      },
    });
    return recommendMissions;
  } catch (err) {
    console.error(err);
    throw new Error("error in fetch User Recommend Missions");
  }
}

async function fetchUserNotInterestedLabels(): Promise<string[]> {
  try {
    const userEmail = await getCurrUserEmail();
    const user = (await prisma.user.findUnique({
      where: { email: userEmail },
      select: { notInterestedLabels: true },
    })) as { notInterestedLabels: { [label: string]: number } } | null;

    if (!user?.notInterestedLabels) return [];

    for (const label in user.notInterestedLabels) {
      if (user.notInterestedLabels[label] < Date.now()) {
        delete user.notInterestedLabels[label];
      }
    }

    // 更新用户的 notInterestedLabels
    await prisma.user.update({
      where: { email: userEmail },
      data: { notInterestedLabels: user.notInterestedLabels },
    });

    return Object.keys(user.notInterestedLabels);
  } catch (err) {
    console.error(err);
    throw new Error("error in fetch User Not Interested Labels");
  }
}

function getUserMainCategory(
  defaultAnnos: { anno: DefaultAnno[]; updatedAt: Date }[],
  notInterestedLabels: string[],
): string[] {
  const map = new Map<string, { cnt: number; totalWeight: number }>();

  for (const { anno, updatedAt } of defaultAnnos) {
    anno.forEach(({ label }) => {
      const superCategory = getSuperCategory(label) ?? "";
      const weight = calcDecayFactor(updatedAt);

      if (!map.has(superCategory)) {
        map.set(superCategory, { cnt: 0, totalWeight: 0 });
      }
      const categoryData = map.get(superCategory)!;
      categoryData.cnt += 1;
      categoryData.totalWeight += weight;
    });
  }
  console.log(map);

  return Array.from(map)
    .filter(([category]) => !notInterestedLabels.includes(category))
    .sort(
      (a, b) =>
        b[1].cnt * 0.5 + b[1].totalWeight - (a[1].cnt * 0.5 + a[1].totalWeight),
    )
    .slice(0, 3)
    .map((a) => a[0]);
}

function calcDecayFactor(
  updatedAt: Date,
  decayRate: number = 0.5,
  halfLife: number = 21,
): number {
  const currentTime = new Date();
  const elapsedTime = currentTime.getTime() - updatedAt.getTime();
  return Math.exp(
    (-decayRate * elapsedTime) / (halfLife * 24 * 60 * 60 * 1000),
  );
}
