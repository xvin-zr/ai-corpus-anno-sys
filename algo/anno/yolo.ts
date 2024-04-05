import { AnnoResult } from ".";

export function resultToYolo(anno: AnnoResult[]): string {
  const res: string[] = [];

  anno.forEach(({ url, annos }) => {
    res.push(url);
    annos.forEach(({ score, box, label }) => {
      res.push(
        `${label} ${score} ${box.xmin} ${box.ymin} ${box.xmax} ${box.ymax}`,
      );
    });
    res.push("");
  });
  return res.join("\n");
}
