"use client";
import clsx from "clsx";
import { atom, useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "react-feather";

export const annoAtom = atom(null);

function AnnoActions({
  missionId,
  imageIndex,
  imagesCount,
}: {
  missionId: string;
  imageIndex: number;
  imagesCount: number;
}) {
  const { push } = useRouter();
  const [anno, setAnno] = useAtom(annoAtom);

  return (
    <div className="flex items-center justify-between">
      <button
        className={clsx(
          "flex h-10 items-center justify-center gap-1 rounded-md bg-blue-bupt px-4 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-v-success focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-v-success dark:hover:bg-v-success-light dark:focus-visible:ring-zinc-300",
          { invisible: imageIndex == 0 },
        )}
        // disabled={}
        onClick={() => {
          console.log((anno as any)?.getAnnotations());
          // push(`/dashboard/my-missions/${missionId}/anno/${imageIndex - 1}`);
        }}
      >
        <ArrowLeft />
        上一个
      </button>

      <button
        className={clsx(
          "flex h-10 items-center justify-center gap-1 rounded-md bg-blue-bupt px-4 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-v-success focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-v-success dark:hover:bg-v-success-light dark:focus-visible:ring-zinc-300",
          { invisible: imageIndex == imagesCount - 1 },
        )}
        onClick={() => {
          console.log((anno as any)?.getAnnotations());
          push(`/dashboard/my-missions/${missionId}/anno/${imageIndex + 1}`);
        }}
        // disabled={}
      >
        下一个
        <ArrowRight />
      </button>
    </div>
  );
}

export default AnnoActions;
