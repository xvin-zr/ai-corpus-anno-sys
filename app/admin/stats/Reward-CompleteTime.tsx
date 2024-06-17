"use client";

import { ScatterChart } from "@tremor/react";

// 不同类别的平均报酬和完成时间
function RewardCompleteTime({
  rewardCompleteTime,
}: {
  rewardCompleteTime: {
    类别: string;
    平均报酬: number;
    平均完成时间: number;
  }[];
}) {
  return (
    <>
      <h1 className="text-xl font-semibold">类别、报酬与时间散点图</h1>
      <ScatterChart
        className="h-80"
        data={rewardCompleteTime}
        category="类别"
        x="平均完成时间"
        y="平均报酬"
        size="平均报酬"
        // colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
        valueFormatter={{
          x: (x) => `${(x / 1000 / 3600).toFixed(2)} 小时`,
          y: (y) => `¥ ${y}`,
        }}
      />
    </>
  );
}

export default RewardCompleteTime;
