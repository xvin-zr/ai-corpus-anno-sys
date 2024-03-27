import clsx from "clsx";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import AnnoActions from "./AnnoActions";
import AnnotationHeader from "./AnnotationHeader";
import {
  fetchDefaultAnnosLen,
  fetchImageInfo,
  fetchImagesIds,
  fetchW3cAnnos,
} from "./data";
const Annotator = dynamic(() => import("./Annotator"), { ssr: false });

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
  if (Number(imageIndex) < 0 || Number(imageIndex) >= imagesIds.length) {
    notFound();
  }

  const { url, width, height } = await fetchImageInfo(
    imagesIds[Number(imageIndex)],
  );
  const w3cAnnos = await fetchW3cAnnos(imagesIds[parseInt(imageIndex)]);
  const defaultAnnosCnt = await fetchDefaultAnnosLen(
    imagesIds[parseInt(imageIndex)],
  );

  return (
    <>
      <AnnotationHeader
        imageIndex={parseInt(imageIndex)}
        imagesCount={imagesIds.length}
        imageId={imagesIds[parseInt(imageIndex)]}
        missionId={missionId}
      />

      <section
        className={clsx(
          `mt-6 flex h-[544px] items-start overflow-auto rounded-lg`,
          { "justify-center": width < 1400, "justify-start": width >= 1400 },
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

      <section className="mt-4" aria-label="annotation-actions">
        <AnnoActions
          missionId={missionId}
          imageIndex={parseInt(imageIndex)}
          imageId={imagesIds[parseInt(imageIndex)]}
          imagesCount={imagesIds.length}
          defaultAnnosCnt={defaultAnnosCnt}
        />
      </section>
    </>
  );
}

export default ImageAnnotationPage;
