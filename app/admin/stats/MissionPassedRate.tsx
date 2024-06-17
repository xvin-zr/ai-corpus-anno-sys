"use client";

import { AreaChart } from "@tremor/react";

function MissionPassedRate({
  passedRate,
}: {
  passedRate: {
    month: string;
    系统审核通过率: number;
    人工审核通过率: number;
  }[];
}) {
  return (
    <>
      <h1 className="text-xl font-semibold">任务通过率趋势</h1>
      <AreaChart
        data={passedRate}
        index="month"
        categories={["系统审核通过率", "人工审核通过率"]}
        // colors={["blue-bupt", "cyan", "indigo", "violet", "fuchsia"]}
      />
    </>
  );
}

export default MissionPassedRate;
