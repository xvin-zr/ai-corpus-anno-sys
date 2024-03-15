"use client";
import { useTransition } from "react";
import { passReviewAction } from "./actions";
import { toastError, toastSuccess } from "@/app/dashboard/components/toast";
import { useRouter } from "next/navigation";

export default function PassReviewBtn({ missionId }: { missionId: string }) {
  const { replace } = useRouter();
  const [isPending, startPassReviewTransition] = useTransition();

  function handlePassReview() {
    startPassReviewTransition(async function passReview() {
      const resp = await passReviewAction(missionId);
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
      className="inline-flex h-10 items-center justify-center gap-1 rounded-md bg-green-800 px-4 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-green-700 dark:hover:bg-green-600 dark:focus-visible:ring-zinc-300"
      disabled={isPending}
      onClick={handlePassReview}
    >
      通过审核
    </button>
  );
}
