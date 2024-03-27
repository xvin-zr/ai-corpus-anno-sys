import { W3CAnno } from "@/app/dashboard/my-missions/[missionId]/anno/[imageIndex]/data";
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

  if (Math.abs(defaultAnnos.length - userAnnos.length) > 3) {
    reviewRes = false;
  }
  const defaultLabels = new Set<string>(defaultAnnos.map((anno) => anno.label));

  for (const userAnno of userAnnos) {
    if (!defaultLabels.has(userAnno.label)) {
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
      defaultAnnos
        .filter((defaultAnno) => defaultAnno.label == userAnno.label)
        .forEach(function (defaultAnno) {
          const bIoU = calcBIoU(defaultAnno.box, correctedUserAnnoBox);
          if (bIoU >= BIoU_THRESHOLD && bIoU > maxBIoU) {
            maxBIoU = bIoU;
            maxBIoUAnno = defaultAnno;
          }
        });

      console.log(maxBIoU, "\n", maxBIoUAnno, "\n", userAnno);
      if (maxBIoU < BIoU_THRESHOLD) {
        reviewRes = false;
        continue;
      }
      maxBIoUAnno?.group.push({
        score: accuracy,
        bIoU: maxBIoU,
        box: userAnno.box,
      });
    }
  }

  return reviewRes;
}
