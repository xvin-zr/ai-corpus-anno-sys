"use client";
import { AreaChart } from "@tremor/react";
import React from "react";

function CompletedMission({
  completedMissions,
}: {
  completedMissions: { month: string; 完成任务数量: number }[];
}) {
  return (
    <>
      <h1 className="text-xl font-semibold">任务完成趋势</h1>
      <AreaChart
        data={completedMissions}
        colors={["blue-bupt"]}
        index="month"
        categories={["完成任务数量"]}
      />
    </>
  );
}

export default CompletedMission;
