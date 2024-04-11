"use server";

import { AnnoResult, resultToCoco, w3cToUserAnno } from "@/algo/anno";
import { DefaultAnno } from "@/algo/BIoU";
import { defaultSoftNMS, userSoftNMS } from "@/algo/soft-NMS";
import { fetchDefaultAnnos } from "@/algo/soft-NMS/data";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-option";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { fetchMissionDetail } from "../../market/data";
import { resultToYolo } from "@/algo/anno/yolo";
import {
  fetchThisMissionType,
  W3CAnno,
} from "../../my-missions/[missionId]/anno/[imageIndex]/data";
import { getCurrUserEmail } from "@/app/data";

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

export async function downloadAnnoResultAction(
  missionId: string,
  annoResType: "coco" | "yolo",
) {
  // 通过 missionId 拿到 imagesIds
  const mission = await fetchMissionDetail(missionId);
  if (!mission)
    throw new Error("mission not found in downloadAnnoResultAction");
  const imagesIds = await fetchImagesIds(missionId);
  const imagesInfos = await fetchImagesInfos(imagesIds);
  const thisMissionType = await fetchThisMissionType(missionId);

  // 并行获取所有图片的 annotations
  const annotationsPromises = imagesInfos.map(async (info) => {
    // 该图片的 default anno
    const { defaultAnnotations } = await fetchDefaultAnnos(info.id);
    const filteredAnnotations = defaultAnnotations.filter(
      (anno) => anno.group.length > 0,
    );
    // 该图片用户的标注
    const userAnnos = await fetchUserAnnos(info.id);
    const annos = (
      await Promise.all(filteredAnnotations.map(mapDefaultAnnoFn))
    ).flat();
    console.log(annos);
    if (thisMissionType == "sysOnly") {
      return { ...info, annos: annos };
    } else {
      return { ...info, annos: userSoftNMS(annos.concat(userAnnos)) };
    }
  });

  const res: AnnoResult[] = await Promise.all(annotationsPromises);

  console.log(res);
  if (annoResType == "coco") {
    return resultToCoco(
      res,
      missionId,
      mission?.description ?? "",
      mission?.publisherEmail,
    );
  } else {
    return resultToYolo(res);
  }
}

async function mapDefaultAnnoFn(anno: DefaultAnno) {
  return defaultSoftNMS(anno);
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

async function fetchUserAnnos(imageId: string) {
  try {
    const { recipientEmail } = (await prisma.mission.findFirst({
      where: {
        imagesIds: {
          has: imageId,
        },
      },
      select: {
        recipientEmail: true,
      },
    })) ?? { recipientEmail: "" };
    const { accuracy } = (await prisma.user.findUnique({
      where: {
        email: recipientEmail ?? "",
      },
      select: {
        accuracy: true,
      },
    })) ?? { accuracy: 0.6 };
    const { w3cAnnotations } = ((await prisma.userAnnotation.findUnique({
      where: {
        imageId_email: {
          email: recipientEmail ?? "",
          imageId: imageId,
        },
      },
      select: {
        w3cAnnotations: true,
      },
    })) ?? { w3cAnnotations: [] }) as unknown as { w3cAnnotations: W3CAnno[] };
    const userAnnos = w3cAnnotations.map((anno) => {
      const ua = w3cToUserAnno(anno, accuracy);
      ua.box.xmin *= 2;
      ua.box.ymin *= 2;
      ua.box.xmax *= 2;
      ua.box.ymax *= 2;
      return {
        ...ua,
        bIoU: ua.score,
      };
    });
    return userAnnos;
  } catch (err) {
    console.error(err);
    throw new Error("error in fetch user annos");
  }
}
