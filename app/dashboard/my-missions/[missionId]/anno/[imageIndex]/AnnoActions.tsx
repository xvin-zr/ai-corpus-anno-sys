"use client";
import clsx from "clsx";
import { atom, useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ArrowLeft, ArrowRight } from "react-feather";
import CategoryPicker from "./CategoryPicker";
import { uploadW3cAnnoAction } from "./actions";

export const annoAtom = atom(null);

function AnnoActions({
  missionId,
  imageIndex,
  imageId,
  imagesCount,
  defaultAnnosCnt,
  reviewBySystem,
  recipientsCnt,
  labels,
}: {
  missionId: string;
  imageIndex: number;
  imageId: string;
  imagesCount: number;
  defaultAnnosCnt: number;
  reviewBySystem: boolean;
  recipientsCnt: number;
  labels: string[];
}) {
  console.log("defaultAnnosCnt", defaultAnnosCnt);
  const { push } = useRouter();
  const [anno, setAnno] = useAtom(annoAtom);
  const [isPending, startPageChangeTransition] = useTransition();
  const onlyReviewByHuman = !reviewBySystem && recipientsCnt == 0;

  function handlePageChange() {
    startPageChangeTransition(async function pageChange() {
      const w3cAnnos = (anno as any)?.getAnnotations();
      await uploadW3cAnnoAction(w3cAnnos, imageId, missionId);
    });
  }

  return (
    <div className="flex items-center justify-between">
      <button
        className={clsx(
          "flex h-10 items-center justify-center gap-1 rounded-md bg-blue-bupt px-4 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-v-success focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-v-success dark:hover:bg-v-success-light dark:focus-visible:ring-zinc-300",
          { invisible: imageIndex == 0 },
        )}
        disabled={isPending}
        onClick={() => {
          handlePageChange();
          push(`/dashboard/my-missions/${missionId}/anno/${imageIndex - 1}`);
        }}
      >
        <ArrowLeft />
        上一个
      </button>
      <span className="text-lg">
        建议最低标注数量：
        {!onlyReviewByHuman
          ? Math.max(defaultAnnosCnt - 1, 1)
          : Math.floor(defaultAnnosCnt / labels.length) || 1}
      </span>

      {!onlyReviewByHuman && <CategoryPicker />}
      {onlyReviewByHuman && (
        <span className="text-lg font-semibold">
          类别：
          <span className="font-normal">{labels.join(", ")}</span>
        </span>
      )}

      <button
        className={clsx(
          "flex h-10 items-center justify-center gap-1 rounded-md bg-blue-bupt px-4 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-v-success focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-v-success dark:hover:bg-v-success-light dark:focus-visible:ring-zinc-300",
          { invisible: imageIndex == imagesCount - 1 },
        )}
        onClick={() => {
          handlePageChange();
          push(`/dashboard/my-missions/${missionId}/anno/${imageIndex + 1}`);
        }}
        disabled={isPending}
      >
        下一个
        <ArrowRight />
      </button>
    </div>
  );
}

export default AnnoActions;
