"use client";

import { DonutChart, Legend } from "@tremor/react";

function MissionCategories({
  categories,
}: {
  categories: { 类别: string; 任务数量: number }[];
}) {
  return (
    <>
      <h1 className="text-xl font-semibold">任务类别分布</h1>
      <Legend
        categories={categories.map((c) => c["类别"])}
        // colors={["blue", "cyan", "indigo", "violet", "fuchsia", 'yellow', 'green']}
        className="max-w-xs"
      />
      <DonutChart
        className="h-80"
        data={categories}
        variant="donut"
        index="类别"
        category="任务数量"
        // colors={["blue", "cyan", "indigo", "violet", "fuchsia", 'yellow', 'green']}
      />
    </>
  );
}

export default MissionCategories;
