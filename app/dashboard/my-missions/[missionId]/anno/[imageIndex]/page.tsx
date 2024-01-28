import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import AnnoActions from "./AnnoActions";
import AnnotationHeader from "./AnnotationHeader";
import { fetchImageInfo, fetchImagesIds } from "./data";
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
  return (
    <>
      <AnnotationHeader
        imageIndex={parseInt(imageIndex)}
        imagesCount={imagesIds.length}
      />

      <section
        className="mt-2 flex h-[544px] items-start justify-center overflow-auto rounded-lg"
        aria-label="annotation-section"
      >
        <Annotator url={url} width={width} height={height} />
      </section>

      <section className="mt-4" aria-label="annotation-actions">
        <AnnoActions
          missionId={missionId}
          imageIndex={parseInt(imageIndex)}
          imagesCount={imagesIds.length}
        />
      </section>
    </>
  );
}

export default ImageAnnotationPage;
