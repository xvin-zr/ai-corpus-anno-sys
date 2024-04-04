"use client";
import { useAtom } from "jotai";
import React, { useTransition } from "react";
import { annoAtom } from "./Annotator";
import { W3CAnno } from "@/app/dashboard/my-missions/[missionId]/anno/[imageIndex]/data";
import { completePreTaskAction } from "./actions";
import { acceptMissionAction } from "../actions";
import { toastError, toastSuccess } from "@/app/dashboard/components/toast";
import { redirect, useRouter } from "next/navigation";

function CompleteBtn({
  missionId,
  imageId,
}: {
  missionId: string;
  imageId: string;
}) {
  const [anno] = useAtom(annoAtom);
  const { replace, back } = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleComplete() {
    startTransition(async function complete() {
      const w3cAnnos: W3CAnno[] = (anno as any)?.getAnnotations();
      const reviewRes = await completePreTaskAction(w3cAnnos, imageId);
      if (reviewRes) {
        const { success, msg } = await acceptMissionAction(missionId);
        if (success) {
          toastSuccess(msg);
          replace("/dashboard/my-missions");
        } else {
          toastError(msg);
          back();
        }
      } else {
        toastError("测试失败，请稍后再次尝试");
        replace("/dashboard/market");
      }
    });
  }
  return (
    <button
      className="flex h-10 items-center justify-center gap-1 rounded-md bg-green-800 px-6 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-green-700 dark:hover:bg-green-600 dark:focus-visible:ring-zinc-300"
      onClick={handleComplete}
    >
      完成测试
    </button>
  );
}

export default CompleteBtn;
