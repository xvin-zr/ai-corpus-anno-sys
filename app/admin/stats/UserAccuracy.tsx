"use client";

import { DonutChart, Legend } from "@tremor/react";
import React from "react";

function UserAccuracy({
  userAccuracy,
}: {
  userAccuracy: { 标注通过率: string; 用户数量: number }[];
}) {
  return (
    <>
      <h1 className="text-xl font-semibold">用户通过率分布</h1>
      <Legend
        categories={["小于 0.5", "0.5 - 0.8", "大于 0.8"]}
        colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
        className="max-w-xs"
      />
      <DonutChart
        className="h-80"
        data={userAccuracy}
        variant="pie"
        category="用户数量"
        index={"标注通过率"}
        colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
      />
    </>
  );
}

export default UserAccuracy;
