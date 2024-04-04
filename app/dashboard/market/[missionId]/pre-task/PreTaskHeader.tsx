import dynamic from "next/dynamic";
import React from "react";
const CompleteBtn = dynamic(() => import("./CompleteBtn"), { ssr: false });

function PreTaskHeader({
  missionId,
  imageId,
}: {
  missionId: string;
  imageId: string;
}) {
  return (
    <header className="flex items-center justify-between text-lg">
      <h1 className={"text-2xl font-semibold"}>任务接受测试</h1>

      <CompleteBtn missionId={missionId} imageId={imageId} />
    </header>
  );
}

export default PreTaskHeader;
