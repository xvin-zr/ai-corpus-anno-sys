import Link from "next/link";

function ReviewMissionBtn({ missionId }: { missionId: string }) {
  return (
    <Link
      href={`${missionId}/review/0`}
      className="flex h-10 items-center justify-center gap-1 rounded-md bg-blue-bupt px-6 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-blue-bupt/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-v-success dark:hover:bg-v-success-light dark:focus-visible:ring-zinc-300"
      //   disabled={userEmail == publisherEmail || pending}
      //   aria-disabled={userEmail == publisherEmail || pending}
      //   formAction={acceptMissionAction}
    >
      审核任务
      {/* {pending && <span className="loading loading-spinner loading-xs" />} */}
    </Link>
  );
}

export default ReviewMissionBtn;
