"use client";

import { useTransition } from "react";
import { addImproveCommentAction } from "./actions";
import { toastError, toastSuccess } from "@/app/dashboard/components/toast";
import { useRouter } from "next/navigation";

export default function ImproveBtn({
  missionId,
  comment,
}: {
  missionId: string;
  comment: string;
}) {
  const { replace } = useRouter();
  const [isPending, startAddCommentTransition] = useTransition();

  function handleAddComment() {
    startAddCommentTransition(async function addComment() {
      const resp = await addImproveCommentAction(missionId, comment);
      if (resp.success) {
        toastSuccess(resp.msg);
      } else {
        toastError(resp.msg);
      }
      replace(`/dashboard/my-publish/${missionId}`);
    });
  }

  return (
    <button
      className="flex h-10 items-center justify-center gap-1 rounded-md bg-blue-bupt px-4 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-blue-bupt/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-v-success dark:hover:bg-v-success-light dark:focus-visible:ring-zinc-300"
      disabled={isPending}
      onClick={handleAddComment}
    >
      要求改进
    </button>
  );
}
