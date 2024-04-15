"use client";

import { AreaChart } from "@tremor/react";

function TotalUser({
  totalUsers,
}: {
  totalUsers: { month: string; 用户数量: number }[];
}) {
  return (
    <>
      <h1 className="text-xl font-semibold">用户增长趋势</h1>
      <AreaChart
        className="h-80 text-zinc-500"
        data={totalUsers}
        index="month"
        colors={["blue-bupt"]}
        categories={["用户数量"]}
      />
    </>
  );
}

export default TotalUser;
