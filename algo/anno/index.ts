import { W3CAnno } from "@/app/dashboard/my-missions/[missionId]/anno/[imageIndex]/data";
import { SuperCategory } from "@/constants";
import CocoCategories from "@/constants/json/coco-categories.json";
import { calcBIoU, DefaultAnno, UserAnno } from "../BIoU";

const BIoU_THRESHOLD = 0.5;

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

  if (Math.abs(defaultAnnos.length - userAnnos.length) >= 3) {
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
            box: userAnno.box,
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
              box: userAnno.box,
            });
        }
      }

      // 判断标注是否已经存在
      const isExisted = maxBIoUAnno?.group.some((anno) => anno.bIoU == maxBIoU);
      if (maxBIoUAnno && !isExisted) {
        maxBIoUAnno.group.push({
          score: accuracy,
          bIoU: maxBIoU,
          box: userAnno.box,
        });
      }
    }
  }

  return reviewRes;
}

function getSuperCategory(category: string): SuperCategory | null {
  var superCategory: SuperCategory | null = null;
  for (const key in CocoCategories) {
    if (CocoCategories[key as SuperCategory].includes(category)) {
      superCategory = key as SuperCategory;
      break;
    }
  }
  return superCategory;
}
