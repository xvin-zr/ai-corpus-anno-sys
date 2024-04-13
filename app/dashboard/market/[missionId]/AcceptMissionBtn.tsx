"use client";
import Link from "next/link";
import { acceptMissionAction } from "./actions";
import { toastError, toastSuccess } from "../../components/toast";
import { useRouter } from "next/navigation";

function AcceptMissionBtn({
  missionId,
  thisMissionType,
}: {
  missionId: string;
  thisMissionType: "sysOnly" | "humanOnly" | "upgraded";
}) {
  const { replace } = useRouter();
  if (thisMissionType == "sysOnly") {
    return (
      <Link
        href={`${missionId}/pre-task`}
        className="flex h-10 cursor-pointer items-center justify-center gap-1 rounded-md bg-blue-bupt px-6 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-blue-bupt/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-v-success-dark dark:hover:bg-v-success dark:focus-visible:ring-zinc-300"
      >
        接受任务
      </Link>
    );
  } else {
    return (
      <button
        className="flex h-10 cursor-pointer items-center justify-center gap-1 rounded-md bg-blue-bupt px-6 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-blue-bupt/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-v-success-dark dark:hover:bg-v-success dark:focus-visible:ring-zinc-300"
        onClick={async function () {
          const { success, msg } = await acceptMissionAction(missionId);
          if (success) {
            toastSuccess("接受任务成功");
            replace("/dashboard/my-missions");
          } else {
            toastError(msg);
            replace("/dashboard/market");
          }
        }}
      >
        接受任务
      </button>
    );
  }
}

export default AcceptMissionBtn;
