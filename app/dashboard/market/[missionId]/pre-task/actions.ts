"use server";

import { reviewAnnos, reviewPreTask, w3cToUserAnno } from "@/algo/anno";
import { fetchDefaultAnnos } from "@/algo/soft-NMS/data";
import { W3CAnno } from "@/app/dashboard/my-missions/[missionId]/anno/[imageIndex]/data";
import { fetchUserAccuracy } from "./data";

export async function completePreTaskAction(
  w3cAnnos: W3CAnno[],
  imageId: string,
): Promise<boolean> {
  console.log(w3cAnnos);
  const accuracy = await fetchUserAccuracy();
  const userAnnos = await Promise.all(
    w3cAnnos.map((anno) => w3cToUserAnno(anno, accuracy)),
  );
  const defaultAnnos = await fetchDefaultAnnos(imageId);
  const reviewRes = await reviewPreTask(
    defaultAnnos.defaultAnnotations,
    userAnnos,
    accuracy,
    2,
  );
  console.log("review result:", reviewRes);
  return reviewRes;
}
