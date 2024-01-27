import React from "react";
import { fetchImageInfo, fetchImagesIds } from "./data";
import { notFound } from "next/navigation";
import AnnotationHeader from "./AnnotationHeader";

async function ImageAnnotationPage({
  params: { imageIndex, missionId },
}: {
  params: { imageIndex: string; missionId: string };
}) {
  if (
    Number.isNaN(Number(imageIndex)) ||
    !Number.isInteger(Number(imageIndex))
  ) {
    notFound();
  }
  const imagesIds = await fetchImagesIds(missionId);
  const image = await fetchImageInfo(imagesIds[Number(imageIndex)]);
  console.log(image);
  return (
    <>
      <AnnotationHeader
        imageIndex={parseInt(imageIndex)}
        imagesCount={imagesIds.length}
      />

      <section
        className="mt-2 flex h-[544px] items-center justify-center"
        aria-label="annotation-section"
      >
        123
      </section>

      <section className="mt-4" aria-label="annotation-actions">
        button
      </section>
    </>
  );
}

export default ImageAnnotationPage;
