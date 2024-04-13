"use client";

import { useTransition } from "react";
import { notInterestedAction } from "./actions";
import toast from "react-hot-toast";
import { toastError, toastSuccess } from "../../components/toast";
import { useRouter } from "next/navigation";

function NotInterestBtn({ missionId }: { missionId: string }) {
  const [isPending, startTransition] = useTransition();
  const { replace } = useRouter();

  function handleNotInterest() {
    startTransition(async function notInterest() {
      const { success, msg } = await notInterestedAction(missionId);
      if (success) {
        toastSuccess(msg);
      } else {
        toastError("操作失败，请稍后再试");
      }
      replace("/dashboard/recommend");
    });
  }

  return (
    <button
      aria-label="not interest button"
      className="flex h-10 items-center justify-center gap-1 rounded-md bg-zinc-600 px-6 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:bg-zinc-700 dark:hover:bg-zinc-800 dark:focus-visible:ring-zinc-300"
      disabled={isPending}
      onClick={handleNotInterest}
    >
      不感兴趣
    </button>
  );
}

export default NotInterestBtn;
