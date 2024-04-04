import { getCurrUserEmail } from "@/app/data";
import prisma from "@/prisma/client";

const preTaskMap = new Map<string, string>();

async function fetchImagesIds(missionId: string): Promise<string[]> {
  try {
    const { imagesIds } = (await prisma.mission.findUnique({
      where: { id: missionId },
      select: { imagesIds: true },
    })) ?? { imagesIds: [] };
    return imagesIds;
  } catch (err) {
    console.error(err);
    throw new Error("error in fetch images ids");
  }
}

export async function getRandomImageId(
  missionId: string,
): Promise<string | undefined> {
  if (preTaskMap.has(missionId)) {
    return preTaskMap.get(missionId);
  }
  const imageIds = await fetchImagesIds(missionId);

  const res = imageIds.at(
    Math.floor(Math.random() * imageIds.length),
  ) as string;
  preTaskMap.set(missionId, res);

  return res;
}

export async function fetchUserAccuracy(): Promise<number> {
  try {
    const userEmail = await getCurrUserEmail();
    const { accuracy } = (await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
      select: {
        accuracy: true,
      },
    })) ?? { accuracy: 0.6 };
    return accuracy;
  } catch (err) {
    console.error(err);
    throw new Error("error in fetch user accuracy");
  }
}
