"use client";
import { useRouter } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { acceptMission } from "./actions";
import { useEffect } from "react";

function AcceptMissionBtn({
  userEmail,
  publisherEmail,
  missionId,
}: {
  userEmail: string;
  publisherEmail: string;
  missionId: string;
}) {
  const { push } = useRouter();
  const { pending } = useFormStatus();
  const acceptMissionWithId = acceptMission.bind(null, missionId);
  const [acceptState, acceptMissionAction] = useFormState(acceptMissionWithId, {
    success: false,
    msg: "",
  });

  useEffect(() => {
    console.log("\nacceptState\n", acceptState);
  }, [acceptState]);

  return (
    <button
      className="flex h-10 items-center justify-center gap-1 rounded-md bg-blue-bupt px-6 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-blue-bupt/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-v-success-dark dark:hover:bg-v-success dark:focus-visible:ring-zinc-300"
      disabled={userEmail == publisherEmail || pending}
      aria-disabled={userEmail == publisherEmail || pending}
      formAction={acceptMissionAction}
    >
      接受任务
      {pending && <span className="loading loading-spinner loading-xs" />}
    </button>
  );
}

export default AcceptMissionBtn;
