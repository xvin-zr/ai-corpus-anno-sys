import {
  fetchImageInfo,
  fetchW3cAnnos,
} from "@/app/dashboard/my-missions/[missionId]/anno/[imageIndex]/data";
import { notFound } from "next/navigation";
import React from "react";
import { fetchImagesIds, fetchReviewAnnos } from "./data";
import ReviewHeader from "./ReviewHeader";
import clsx from "clsx";
import dynamic from "next/dynamic";
import ReviewActions from "./ReviewActions";
const Annotator = dynamic(() => import("./Annotator"), { ssr: false });

async function ImageReviewPage({
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
  if (Number(imageIndex) < 0 || Number(imageIndex) >= imagesIds.length) {
    notFound();
  }

  const { url, width, height } = await fetchImageInfo(
    imagesIds[Number(imageIndex)],
  );
  const w3cAnnos = await fetchReviewAnnos(
    missionId,
    imagesIds[parseInt(imageIndex)],
  );

  return (
    <>
      <ReviewHeader
        imageIndex={parseInt(imageIndex)}
        imagesCount={imagesIds.length}
        imageId={imagesIds[parseInt(imageIndex)]}
        missionId={missionId}
      />

      <section
        className={clsx(
          "mt-6 flex h-[544px] items-start justify-center overflow-auto rounded-lg",
        )}
        aria-label="annotation-section"
      >
        <Annotator
          url={url}
          width={width}
          height={height}
          w3cAnnos={w3cAnnos || []}
        />
      </section>

      <section className="mt-4" aria-label="review-actions">
        <ReviewActions
          missionId={missionId}
          imageIndex={parseInt(imageIndex)}
          imageId={imagesIds[parseInt(imageIndex)]}
          imagesCount={imagesIds.length}
        />
      </section>
    </>
  );
}

export default ImageReviewPage;
