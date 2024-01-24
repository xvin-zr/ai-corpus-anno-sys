"use client";

function CompleteMissionBtn() {
  return (
    <button
      className="flex h-10 items-center justify-center gap-1 rounded-md bg-green-700 px-6 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-green-700/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-green-600 dark:hover:bg-green-500 dark:focus-visible:ring-zinc-300"
      //   disabled={userEmail == publisherEmail || pending}
      //   aria-disabled={userEmail == publisherEmail || pending}
      //   formAction={acceptMissionAction}
    >
      完成任务
      {/* {pending && <span className="loading loading-spinner loading-xs" />} */}
    </button>
  );
}

export default CompleteMissionBtn;
