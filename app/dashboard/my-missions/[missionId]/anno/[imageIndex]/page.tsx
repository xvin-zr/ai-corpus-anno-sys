import clsx from "clsx";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import AnnoActions from "./AnnoActions";
import AnnotationHeader from "./AnnotationHeader";
import { fetchImageInfo, fetchImagesIds, fetchW3cAnnos } from "./data";
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
  const { url, width, height } = await fetchImageInfo(
    imagesIds[Number(imageIndex)],
  );
  const w3cAnnos = await fetchW3cAnnos(imagesIds[parseInt(imageIndex)]);
  console.log(w3cAnnos);

  return (
    <>
      <AnnotationHeader
        imageIndex={parseInt(imageIndex)}
        imagesCount={imagesIds.length}
      />

      <section
        className={clsx(
          "mt-2 flex h-[544px] items-start justify-center overflow-auto rounded-lg",
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
        />
      </section>
    </>
  );
}

export default ImageAnnotationPage;
