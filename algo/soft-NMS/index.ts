import { Box } from "@/constants";
import { calcBIoU, DefaultAnno } from "../BIoU";
import { fetchDefaultAnnos } from "./data";

const NMS_THRESH = 0.1;
const SIGMA = 0.5;

export function softNMS(defaultAnnos: DefaultAnno) {
  const sortedAnnos = defaultAnnos.group.toSorted((a, b) => b.score - a.score);

  const res: {
    score: number;
    box: Box;
    bIoU: number;
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
