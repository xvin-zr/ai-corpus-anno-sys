import { Box, Category } from "@/constants";

// function calcBIoU(defaultAnno: DefaultAnno, userAnno: UserAnno): number {
//   return NaN;
// }

export function calcBIoU(box1: Box, box2: Box): number {
  const iou = calcIoU(box1, box2);
  const loss = calcRegLoss(box1, box2);
  return iou - loss;
}

function calcIoU(box1: Box, box2: Box): number {
  // Calculate the area of overlap (intersection)
  const xMinOverlap = Math.max(box1.xmin, box2.xmin); // Ensures non-negative overlap
  const yMinOverlap = Math.max(box1.ymin, box2.ymin);
  const xMaxOverlap = Math.min(box1.xmax, box2.xmax);
  const yMaxOverlap = Math.min(box1.ymax, box2.ymax);

  const widthOverlap = Math.max(0, xMaxOverlap - xMinOverlap);
  const heightOverlap = Math.max(0, yMaxOverlap - yMinOverlap);
  const areaOverlap = widthOverlap * heightOverlap;

  // Calculate the area of union
  const area1 = (box1.xmax - box1.xmin) * (box1.ymax - box1.ymin);
  const area2 = (box2.xmax - box2.xmin) * (box2.ymax - box2.ymin);
  const areaUnion = area1 + area2 - areaOverlap; // Avoid double counting intersection

  // Handle division by zero (no overlap)
  if (areaUnion === 0) {
    return 0;
  }

  // Calculate IoU as the intersection area divided by the union area
  return areaOverlap / areaUnion;
}

export type DefaultAnno = {
  label: Category;
  score: number;
  box: Box;
  group: {
    label?: string;
    score: number;
    box: Box;
    bIoU: number;
  }[];
};

export type UserAnno = {
  label: string;
  score: number;
  box: Box;
};

function diagDist(box1: Box, box2: Box): number {
  const xmin = Math.min(box1.xmin, box2.xmin);
  const ymin = Math.min(box1.ymin, box2.ymin);
  const xmax = Math.max(box1.xmax, box2.xmax);
  const ymax = Math.max(box1.ymax, box2.ymax);

  // 返回 c^2
  return Math.pow(xmax - xmin, 2) + Math.pow(ymax - ymin, 2);
}

function centerDiff(box1: Box, box2: Box): { WC: number; HC: number } {
  const x1 = box1.xmin + ((box1.xmax - box1.xmin) >> 1);
  const y1 = box1.ymin + ((box1.ymax - box1.ymin) >> 1);
  const x2 = box2.xmin + ((box2.xmax - box2.xmin) >> 1);
  const y2 = box2.ymin + ((box2.ymax - box2.ymin) >> 1);

  return {
    WC: Math.abs(x1 - x2),
    HC: Math.abs(y1 - y2),
  };
}

function calcMNEandMXE(box1: Box, box2: Box): { MNE: number; MXE: number } {
  const { sqrt, pow } = Math;
  const MNE = sqrt(
    pow(box1.xmin - box2.xmin, 2) + pow(box1.ymin - box2.ymin, 2),
  );
  const MXE = sqrt(
    pow(box1.xmax - box2.xmax, 2) + pow(box1.ymax - box2.ymax, 2),
  );

  return { MNE, MXE };
}

function calcRegLoss(box1: Box, box2: Box): number {
  const { WC, HC } = centerDiff(box1, box2);
  const { MNE, MXE } = calcMNEandMXE(box1, box2);
  const cSquare = diagDist(box1, box2);

  return (WC + HC + MNE + MXE) / cSquare;
}
