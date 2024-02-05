"use client";

import { toastError } from "@/app/dashboard/components/toast";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { annoAtom } from "./AnnoActions";
import { completeMissionAction } from "./actions";

function CompleteAnnoBtn({
  imageIndex,
  imagesCount,
  imageId,
  missionId,
}: {
  imageIndex: number;
  imagesCount: number;
  imageId: string;
  missionId: string;
}) {
  const [anno, setAnno] = useAtom(annoAtom);
  const [isPending, startCompleteMissionTransition] = useTransition();
  const { replace } = useRouter();

  function handleCompleteMission() {
    startCompleteMissionTransition(async function completeMission() {
      const w3cAnnos = (anno as any)?.getAnnotations();
      const success = await completeMissionAction(w3cAnnos, imageId, missionId);
      if (success) replace(`/dashboard/my-missions/${missionId}`);
      else {
        toastError("标注提交失败，请稍后再试");
      }
    });
  }

  return (
    <button
      className="flex h-10 items-center justify-center gap-1 rounded-md bg-green-800 px-6 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-green-700 dark:hover:bg-green-600 dark:focus-visible:ring-zinc-300"
      disabled={imageIndex != imagesCount - 1 || isPending}
      onClick={handleCompleteMission}
    >
      完成标注
    </button>
  );
}

export default CompleteAnnoBtn;
