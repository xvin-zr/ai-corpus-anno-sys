"use client";

import { fetchDefaultAnnos } from "@/algo/soft-NMS/data";
import { useTransition } from "react";
import { downloadAnnoResultAction } from "./actions";

function DownloadResBtn({ missionId }: { missionId: string }) {
  const [isPending, downloadAnnoResTransition] = useTransition();
  function handleDownload() {
    // TODO: 完成标注下载
    downloadAnnoResTransition(async function downloadAnnoRes() {
      const res = await downloadAnnoResultAction(missionId);
      const blob = new Blob([JSON.stringify(res)], {
        type: "application/json",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `mission-${missionId}-result.json`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
    // var imageId = "wryd2nf91usb6vml7gzi";
    // const defaultAnnos = await fetchDefaultAnnos(imageId);
    // console.log("download");
  }
  return (
    <button
      className="flex h-10 items-center justify-center gap-1 rounded-md bg-zinc-600 px-4 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 dark:bg-zinc-700 dark:hover:bg-zinc-800 dark:focus-visible:ring-zinc-300"
      onClick={handleDownload}
      disabled={isPending}
    >
      下载标注结果{" "}
      {isPending && (
        <span className="loading loading-spinner loading-xs"></span>
      )}
    </button>
  );
}

export default DownloadResBtn;
