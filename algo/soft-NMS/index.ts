import { Box } from "@/constants";
import { calcBIoU, DefaultAnno } from "../BIoU";
import { fetchDefaultAnnos } from "./data";

const NMS_THRESH = 0.2;
const SIGMA = 0.5;

export function defaultSoftNMS(defaultAnnos: DefaultAnno) {
  // 低分数时判断所有用户标注的 label 是否一致
  if (defaultAnnos.score < 0.75) {
    const thisLabel = defaultAnnos.group[0].label;
    const isSame = defaultAnnos.group.every((anno) => anno.label == thisLabel);
    // 不一致跳过该标注
    if (!isSame) return [];
  }

  // 置信度高或者低置信度且标注一致时，使用 soft NMS
  const sortedAnnos = defaultAnnos.group
    .map(function calcScore(anno) {
      return {
        ...anno,
        score: 0.6 * anno.bIoU + 0.4 * anno.score,
      };
    })
    .toSorted((a, b) => b.score - a.score);

  const res: {
    score: number;
    box: Box;
    bIoU: number;
    label: string;
  }[] = [];
  const suppressed: boolean[] = new Array(sortedAnnos.length).fill(false);

  for (let i = 0; i < sortedAnnos.length; ++i) {
    if (suppressed[i]) continue;

    const anno = sortedAnnos[i];
    res.push(anno);

    // 计算当前框与其他框的 BIoU
    for (let j = i + 1; j < sortedAnnos.length; ++j) {
      if (suppressed[j]) continue;

      const otherAnno = sortedAnnos[j];
      const bIoU = calcBIoU(anno.box, otherAnno.box);

      // 计算 soft NMS 权重
      const weight = Math.exp(-Math.pow(bIoU, 2) / SIGMA);
      // 抑制低分数的框
      otherAnno.score *= weight;
      if (otherAnno.score < NMS_THRESH) {
        suppressed[j] = true;
      }
    }
  }

  return res;
}

export function userSoftNMS(
  annos: {
    score: number;
    box: Box;
    bIoU: number;
    label: string;
  }[],
) {
  const sortedAnnos = annos
    .map(function calcScore(anno) {
      return {
        ...anno,
        score: 0.6 * anno.bIoU + 0.4 * anno.score,
      };
    })
    .toSorted((a, b) => b.score - a.score);

  const res: {
    score: number;
    box: Box;
    bIoU: number;
    label: string;
  }[] = [];
  const suppressed: boolean[] = new Array(sortedAnnos.length).fill(false);

  for (let i = 0; i < sortedAnnos.length; ++i) {
    if (suppressed[i]) continue;

    const anno = sortedAnnos[i];
    res.push(anno);

    // 计算当前框与其他框的 BIoU
    for (let j = i + 1; j < sortedAnnos.length; ++j) {
      if (suppressed[j]) continue;

      const otherAnno = sortedAnnos[j];
      const bIoU = calcBIoU(anno.box, otherAnno.box);

      // 计算 soft NMS 权重
      const weight = Math.exp(-Math.pow(bIoU, 2) / SIGMA);
      // 抑制低分数的框
      otherAnno.score *= weight;
      if (otherAnno.score < NMS_THRESH) {
        suppressed[j] = true;
      }
    }
  }

  console.log('usersoftNMS res:', res)
  return res;
}
