"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { acceptMissionAction } from "./actions";
import { toastError, toastSuccess } from "../../components/toast";

function AcceptMissionBtn({
  userEmail,
  publisherEmail,
  missionId,
}: {
  userEmail: string;
  publisherEmail: string;
  missionId: string;
}) {
  const { replace } = useRouter();
  const [isPending, startAcceptMissionTransition] = useTransition();

  function handleAcceptMission() {
    console.log("accept");
    startAcceptMissionTransition(async function acceptMission() {
      const acceptRes = await acceptMissionAction.bind(null, missionId)();
      if (acceptRes.success) {
        toastSuccess(acceptRes.msg);
        replace("/dashboard/my-missions");
      } else {
        toastError(acceptRes.msg);
      }
    });
  }

  return (
    <button
      className="flex h-10 items-center justify-center gap-1 rounded-md bg-blue-bupt px-6 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-blue-bupt/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-v-success-dark dark:hover:bg-v-success dark:focus-visible:ring-zinc-300"
      disabled={userEmail == publisherEmail || isPending}
      aria-disabled={userEmail == publisherEmail || isPending}
      onClick={handleAcceptMission}
    >
      接受任务
      {isPending && <span className="loading loading-spinner loading-xs" />}
    </button>
  );
}

export default AcceptMissionBtn;
