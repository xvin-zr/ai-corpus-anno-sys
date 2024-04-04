import { fetchImageInfo } from "@/app/dashboard/my-missions/[missionId]/anno/[imageIndex]/data";
import clsx from "clsx";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import PreTaskAnnoActions from "./AnnoActions";
import PreTaskHeader from "./PreTaskHeader";
import { getRandomImageId } from "./data";
const Annotator = dynamic(() => import("./Annotator"), { ssr: false });

async function PreTaskPage({
  params: { missionId },
}: {
  params: { missionId: string };
}) {
  const imageId = await getRandomImageId(missionId);
  if (imageId === undefined) {
    notFound();
  }

  const imageInfo = await fetchImageInfo(imageId);

  return (
    <>
      <PreTaskHeader missionId={missionId} imageId={imageId} />

      <section
        className={clsx(
          `mt-6 flex h-[544px] items-start overflow-auto rounded-lg`,
          {
            "justify-center": imageInfo.width < 1400,
            "justify-start": imageInfo.width >= 1400,
          },
        )}
        aria-label="annotation-section"
      >
        <Annotator
          url={imageInfo.url}
          width={imageInfo.width}
          height={imageInfo.height}
        />
      </section>

      <PreTaskAnnoActions />
    </>
  );
}

export default PreTaskPage;
