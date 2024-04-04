import React, { ReactNode } from "react";

function PreTaskLayout({
  children,
  params: { missionId },
}: {
  children: ReactNode;
  params: { missionId: string };
}) {
  return (
    <div aria-label="pre-task-layout" className="md:-ml-6 md:-mr-6 md:-mt-6">
      {children}
    </div>
  );
}

export default PreTaskLayout;
