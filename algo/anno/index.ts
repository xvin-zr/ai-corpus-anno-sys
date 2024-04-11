import { W3CAnno } from "@/app/dashboard/my-missions/[missionId]/anno/[imageIndex]/data";
import { Box, Category, SERVER_URL, SuperCategory } from "@/constants";
import CocoCategories from "@/constants/json/coco-categories.json";
import CocoNumbered from "@/constants/json/coco-numbered.json";
import { calcBIoU, DefaultAnno, UserAnno } from "../BIoU";
import {
  COCO_CATEGORIES,
  CocoAnnotation,
  CocoFormat,
  CocoImage,
  CocoInfo,
  CocoLicense,
} from "./coco";

const BIoU_THRESHOLD = 0.5;

export type AnnoResult = {
  id: string;
  url: string;
  width: number | null;
  height: number | null;
  filename: string | null;
  annos: {
    score: number;
    box: Box;
    bIoU: number;
    label: string;
  }[];
};

export function w3cToUserAnno(w3cAnno: W3CAnno, accuracy: number): UserAnno {
  const [x, y, w, h] = w3cAnno.target.selector.value
    .split("pixel:")[1]
    .split(",")
    .map(parseFloat);
  return {
    label: w3cAnno.body[0].value,
    score: accuracy,
    box: {
      xmin: x,
      ymin: y,
      xmax: x + w,
      ymax: y + h,
    },
  };
}

export async function reviewAnnos(
  defaultAnnos: DefaultAnno[],
  userAnnos: UserAnno[],
  accuracy: number,
  pixelRatio: number,
): Promise<boolean> {
  var reviewRes = true;

  if (
    Math.abs(defaultAnnos.length - userAnnos.length) >= 3 ||
    userAnnos.length == 0
  ) {
    reviewRes = false;
  }
  // 得到 super catrgory Set
  const superCategories = defaultAnnos.map(
    (anno) => getSuperCategory(anno.label) ?? "",
  );
  const defaultLabels = new Set<string | null>(superCategories);

  for (const userAnno of userAnnos) {
    if (!defaultLabels.has(getSuperCategory(userAnno.label))) {
      reviewRes = false;
    } else {
      let maxBIoU = 0;
      let maxBIoUAnno: DefaultAnno | undefined;
      const correctedUserAnnoBox = {
        xmin: userAnno.box.xmin * pixelRatio,
        ymin: userAnno.box.ymin * pixelRatio,
        xmax: userAnno.box.xmax * pixelRatio,
        ymax: userAnno.box.ymax * pixelRatio,
      };
      console.log("\nreview anno\n", correctedUserAnnoBox);

      // 找到最大 BIoU 的标注
      defaultAnnos
        // .filter((defaultAnno) => defaultAnno.label == userAnno.label)
        .forEach(function (defaultAnno) {
          const bIoU = calcBIoU(defaultAnno.box, correctedUserAnnoBox);
          if (bIoU >= BIoU_THRESHOLD && bIoU > maxBIoU) {
            maxBIoU = bIoU;
            maxBIoUAnno = defaultAnno;
          }
        });

      console.log(maxBIoU, "\n", maxBIoUAnno, "\n", userAnno);
      // 如果最大 BIoU 小于阈值，则标注不通过
      if (maxBIoU < BIoU_THRESHOLD || !maxBIoUAnno) {
        reviewRes = false;
        continue;
      }

      // 检查用户标注 label 与最大 BIoU 标注 label 是否一致
      if (userAnno.label == String(maxBIoUAnno.label)) {
        // 判断标注是否已经存在
        const isExisted = maxBIoUAnno?.group.some(
          (anno) => anno.bIoU == maxBIoU,
        );
        !isExisted &&
          maxBIoUAnno.group.push({
            label: userAnno.label,
            score: accuracy,
            bIoU: maxBIoU,
            box: correctedUserAnnoBox,
          });
      } else {
        // 判断用户 accuracy 是否大于最大 BIoU 标注 score
        if (accuracy > maxBIoUAnno.score) {
          const isExisted = maxBIoUAnno?.group.some(
            (anno) => anno.bIoU == maxBIoU,
          );
          !isExisted &&
            maxBIoUAnno.group.push({
              label: userAnno.label,
              score: accuracy,
              bIoU: maxBIoU,
              box: correctedUserAnnoBox,
            });
        }
      }

      // 判断标注是否已经存在
      // const isExisted = maxBIoUAnno?.group.some((anno) => anno.bIoU == maxBIoU);
      // if (maxBIoUAnno && !isExisted) {
      //   maxBIoUAnno.group.push({
      //     score: accuracy,
      //     bIoU: maxBIoU,
      //     box: userAnno.box,
      //     label: userAnno.label,
      //   });
      // }
    }
  }

  return reviewRes;
}

export async function reviewBeforePublisher(
  defaultAnnos: DefaultAnno[],
  userAnnos: UserAnno[],
  cand_labels: string[],
  accuracy: number = 0.6,
  pixelRatio: number = 2,
): Promise<boolean> {
  var reviewRes = true;

  if (userAnnos.length == 0) {
    return false;
  }

  for (const userAnno of userAnnos) {
    if (!cand_labels.includes(userAnno.label)) {
      return false;
    }
    let maxBIoU = 0;
    let maxBIoUAnno: DefaultAnno | undefined;
    const correctedUserAnnoBox = {
      xmin: userAnno.box.xmin * pixelRatio,
      ymin: userAnno.box.ymin * pixelRatio,
      xmax: userAnno.box.xmax * pixelRatio,
      ymax: userAnno.box.ymax * pixelRatio,
    };
    console.log("\nreview anno\n", correctedUserAnnoBox);

    // 找到最大 BIoU 的标注
    defaultAnnos.forEach(function (defaultAnno) {
      const bIoU = calcBIoU(defaultAnno.box, correctedUserAnnoBox);
      if (bIoU >= BIoU_THRESHOLD && bIoU > maxBIoU) {
        maxBIoU = bIoU;
        maxBIoUAnno = defaultAnno;
      }
    });

    console.log(maxBIoU, "\n", maxBIoUAnno, "\n", userAnno);
    // 如果最大 BIoU 小于阈值，则标注不通过
    if (
      maxBIoU < BIoU_THRESHOLD ||
      !maxBIoUAnno ||
      userAnno.label != maxBIoUAnno.label
    ) {
      reviewRes = false;
      continue;
    }

    const isExisted = maxBIoUAnno?.group.some((anno) => anno.bIoU == maxBIoU);
    !isExisted &&
      maxBIoUAnno.group.push({
        label: userAnno.label,
        score: accuracy,
        bIoU: maxBIoU,
        box: correctedUserAnnoBox,
      });
  }
  return reviewRes;
}

export async function reviewPreTask(
  defaultAnnos: DefaultAnno[],
  userAnnos: UserAnno[],
  accuracy: number,
  pixelRatio: number,
): Promise<boolean> {
  // 通过率大于 0.5 才审核通过
  var reviewRes = true;
  var passedAnnoCnt = 0;

  // 得到 super catrgory Set
  const superCategories = defaultAnnos.map(
    (anno) => getSuperCategory(anno.label) ?? "",
  );
  const defaultLabels = new Set<string | null>(superCategories);

  for (const userAnno of userAnnos) {
    if (!defaultLabels.has(getSuperCategory(userAnno.label))) {
      reviewRes = false;
    } else {
      let maxBIoU = 0;
      let maxBIoUAnno: DefaultAnno | undefined;
      const correctedUserAnnoBox = {
        xmin: userAnno.box.xmin * pixelRatio,
        ymin: userAnno.box.ymin * pixelRatio,
        xmax: userAnno.box.xmax * pixelRatio,
        ymax: userAnno.box.ymax * pixelRatio,
      };
      console.log("\nreview anno\n", correctedUserAnnoBox);

      // 找到最大 BIoU 的标注
      defaultAnnos
        // .filter((defaultAnno) => defaultAnno.label == userAnno.label)
        .forEach(function (defaultAnno) {
          const bIoU = calcBIoU(defaultAnno.box, correctedUserAnnoBox);
          if (bIoU >= BIoU_THRESHOLD && bIoU > maxBIoU) {
            maxBIoU = bIoU;
            maxBIoUAnno = defaultAnno;
          }
        });

      console.log(maxBIoU, "\n", maxBIoUAnno, "\n", userAnno);
      // 如果最大 BIoU 小于阈值，则标注不通过
      if (maxBIoU < BIoU_THRESHOLD || !maxBIoUAnno) {
        continue;
      }

      // BIoU 审核通过，计数
      passedAnnoCnt += 1;

      // 检查用户标注 label 与最大 BIoU 标注 label 是否一致
      if (userAnno.label == String(maxBIoUAnno.label)) {
        // 判断标注是否已经存在
        const isExisted = maxBIoUAnno?.group.some(
          (anno) => anno.bIoU == maxBIoU,
        );
        !isExisted &&
          maxBIoUAnno.group.push({
            label: userAnno.label,
            score: accuracy,
            bIoU: maxBIoU,
            box: correctedUserAnnoBox,
          });
      } else {
        // 判断用户 accuracy 是否大于最大 BIoU 标注 score
        if (accuracy > maxBIoUAnno.score) {
          const isExisted = maxBIoUAnno?.group.some(
            (anno) => anno.bIoU == maxBIoU,
          );
          !isExisted &&
            maxBIoUAnno.group.push({
              label: userAnno.label,
              score: accuracy,
              bIoU: maxBIoU,
              box: correctedUserAnnoBox,
            });
        }
      }

      // 判断标注是否已经存在
      // const isExisted = maxBIoUAnno?.group.some((anno) => anno.bIoU == maxBIoU);
      // if (maxBIoUAnno && !isExisted) {
      //   maxBIoUAnno.group.push({
      //     score: accuracy,
      //     bIoU: maxBIoU,
      //     box: userAnno.box,
      //     label: userAnno.label,
      //   });
      // }
    }
  }

  return reviewRes && passedAnnoCnt / defaultAnnos.length >= 0.5;
}

export function resultToCoco(
  anno: AnnoResult[],
  missionId: string,
  description: string = "",
  publisher: string = "system",
): CocoFormat {
  const info: CocoInfo = {
    year: new Date().getFullYear(),
    version: "1.0",
    description: description,
    contributor: publisher,
    url: `${SERVER_URL}/dashboard/my-publish/${missionId}`,
    date_created: new Date(),
  };
  const licenses: CocoLicense[] = [
    {
      id: 1,
      name: "Attribution-NonCommercial-ShareAlike License",
      url: "http://creativecommons.org/licenses/by-nc-sa/2.0/",
    },
  ];
  const images: CocoImage[] = [];
  const annotations: CocoAnnotation[] = [];
  anno.forEach(function (a) {
    const imageAnno = resultToCocoImageAnno(a);
    for (const { image, annotation } of imageAnno) {
      const isImageExisted = images.some((i) => i.coco_url == image.coco_url);
      !isImageExisted && images.push(image);
      annotations.push(annotation);
    }
  });

  return {
    info,
    licenses,
    images,
    annotations,
    // categories: COCO_CATEGORIES,
  };
}

function resultToCocoImageAnno(anno: AnnoResult) {
  return anno.annos.map(function (a, i) {
    return {
      image: {
        id: anno.id,
        url: anno.url,
        width: anno.width ?? 0,
        height: anno.height ?? 0,
        file_name: anno.filename ?? "",
        license: 1,
        flickr_url: "",
        coco_url: anno.url,
        date_captured: new Date(),
      },
      annotation: {
        id: anno.id + "_" + String(i).padStart(2, "0"),
        image_id: anno.id,
        category_id: CocoNumbered[a.label as Category] ?? NaN,
        category: a.label,
        segmentation: "RLE" as "RLE",
        bbox: [
          a.box.xmin,
          a.box.ymin,
          a.box.xmax - a.box.xmin,
          a.box.ymax - a.box.ymin,
        ] as [number, number, number, number],
        area: (a.box.xmax - a.box.xmin) * (a.box.ymax - a.box.ymin),
        iscrowd: (a.label == "person" ? 1 : 0) as 0 | 1,
      },
    };
  });
}

export function getSuperCategory(category: string): SuperCategory | null {
  var superCategory: SuperCategory | null = null;
  for (const key in CocoCategories) {
    if (CocoCategories[key as SuperCategory].includes(category)) {
      superCategory = key as SuperCategory;
      break;
    }
  }
  return superCategory;
}
