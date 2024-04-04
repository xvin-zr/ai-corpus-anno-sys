import Link from "next/link";

function AcceptMissionBtn({ missionId }: { missionId: string }) {
  return (
    <Link
      href={`${missionId}/pre-task`}
      className="flex h-10 cursor-pointer items-center justify-center gap-1 rounded-md bg-blue-bupt px-6 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-blue-bupt/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-v-success-dark dark:hover:bg-v-success dark:focus-visible:ring-zinc-300"
    >
      接受任务
    </Link>
  );
}

export default AcceptMissionBtn;
