import clsx from "clsx";
import Link from "next/link";
import React from "react";
import { ArrowLeft, ArrowRight } from "react-feather";

function ReviewActions({
  missionId,
  imageIndex,
  imageId,
  imagesCount,
}: {
  missionId: string;
  imageIndex: number;
  imageId: string;
  imagesCount: number;
}) {
  return (
    <div className="flex items-center justify-between">
      <Link
        href={`/dashboard/my-publish/${missionId}/review/${imageIndex - 1}`}
        className={clsx(
          "flex h-10 items-center justify-center gap-1 rounded-md bg-blue-bupt px-4 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-v-success focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-v-success dark:hover:bg-v-success-light dark:focus-visible:ring-zinc-300",
          { invisible: imageIndex == 0 },
        )}
        // disabled={isPending}
        // onClick={() => {
        //   handlePageChange();
        //   push(`/dashboard/my-missions/${missionId}/anno/${imageIndex - 1}`);
        // }}
      >
        <ArrowLeft />
        上一个
      </Link>

      <Link
        href={`/dashboard/my-publish/${missionId}/review/${imageIndex + 1}`}
        className={clsx(
          "flex h-10 items-center justify-center gap-1 rounded-md bg-blue-bupt px-4 text-base font-medium text-zinc-50 shadow transition-colors hover:bg-v-success focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-v-success dark:hover:bg-v-success-light dark:focus-visible:ring-zinc-300",
          { invisible: imageIndex == imagesCount - 1 },
        )}
        // onClick={() => {
        //   handlePageChange();
        //   push(`/dashboard/my-missions/${missionId}/anno/${imageIndex + 1}`);
        // }}
        // disabled={isPending}
      >
        下一个
        <ArrowRight />
      </Link>
    </div>
  );
}

export default ReviewActions;
