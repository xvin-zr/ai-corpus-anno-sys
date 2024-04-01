"use server";

import { AnnoResult, resultToCoco } from "@/algo/anno";
import { DefaultAnno } from "@/algo/BIoU";
import { softNMS } from "@/algo/soft-NMS";
import { fetchDefaultAnnos } from "@/algo/soft-NMS/data";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-option";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { fetchMissionDetail } from "../../market/data";

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

export async function downloadAnnoResultAction(missionId: string) {
  // 通过 missionId 拿到 imagesIds
  const mission = await fetchMissionDetail(missionId);
  if (!mission)
    throw new Error("mission not found in downloadAnnoResultAction");
  const imagesIds = await fetchImagesIds(missionId);
  const imagesInfos = await fetchImagesInfos(imagesIds);

  // 并行获取所有图片的 annotations
  const annotationsPromises = imagesInfos.map(async (info) => {
    const { defaultAnnotations } = await fetchDefaultAnnos(info.id);
    const filteredAnnotations = defaultAnnotations.filter(
      (anno) => anno.group.length > 0,
    );
    const annos = await Promise.all(filteredAnnotations.map(mapDefaultAnnoFn));
    return { ...info, annos: annos.flat() };
  });

  const res: AnnoResult[] = await Promise.all(annotationsPromises);

  console.log(res);
  return resultToCoco(
    res,
    missionId,
    mission?.description ?? "",
    mission?.publisherEmail,
  );
}

async function mapDefaultAnnoFn(anno: DefaultAnno) {
  return softNMS(anno);
}

async function fetchImagesInfos(imagesIds: string[]) {
  try {
    const imagesInfos = await prisma.image.findMany({
      where: {
        id: {
          in: imagesIds,
        },
      },
      select: {
        id: true,
        url: true,
        width: true,
        height: true,
        filename: true,
      },
    });

    return imagesInfos;
  } catch (err) {
    console.error(err);
    throw new Error("fetch images infos failed");
  }
}

async function fetchImagesIds(missionId: string) {
  try {
    const { imagesIds } = (await prisma.mission.findUnique({
      where: {
        id: missionId,
      },
      select: {
        imagesIds: true,
      },
    })) ?? { imagesIds: [] };

    return imagesIds;
  } catch (err) {
    console.error(err);
    throw new Error("fetch images ids failed");
  }
}
