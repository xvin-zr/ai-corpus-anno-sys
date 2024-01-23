import React from "react";
import { MissionStatus } from "@prisma/client";
import clsx from "clsx";

function StatusBadge({ status }: { status: MissionStatus }) {
  const badgeStyle = clsx(
    "inline-flex items-center rounded-md px-2 py-1 text-base font-medium",
    {
      "bg-v-success/20 text-v-success dark:bg-v-success-light/20 dark:text-v-success-light":
        status == "PENDING_ACCEPT",
      "bg-green-50 text-green-700 dark:bg-green-200/20 dark:text-green-600/95":
        status == "COMPLETED",
      "dark:bg-v-warning-light/20 dark:text-v-warning-light/80":
        status == "ONGOING",
      "dark:bg-purple-500/20 dark:text-purple-500":
        status == "PENDING_REVIEW",
      "dark:bg-v-error-light/20 dark:text-v-error/90": status == "PENDING_IMPROVE",
    },
  );
  return (
    <span className={badgeStyle}>
      {clsx({
        待接受: status == "PENDING_ACCEPT",
        进行中: status == "ONGOING",
        待审核: status == "PENDING_REVIEW",
        待改进: status == "PENDING_IMPROVE",
        已完成: status == "COMPLETED",
      })}
    </span>
  );
}

export default StatusBadge;
