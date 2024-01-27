import React, { ReactNode } from "react";
import { fetchImagesIds } from "./data";

async function ImageAnnotationLayout({
  children,
  params: { missionId },
}: {
  children: ReactNode;
  params: { missionId: string };
}) {
  await fetchImagesIds(missionId);
  return (
    <div aria-label="anno-layout" className="md:-ml-6 md:-mr-6 md:-mt-6">
      {children}
    </div>
  );
}

export default ImageAnnotationLayout;
