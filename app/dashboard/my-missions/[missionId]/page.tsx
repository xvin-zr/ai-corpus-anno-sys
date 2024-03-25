import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "react-feather";
import { heading1Style } from "../../components/header.style";
import Carousel from "../../market/[missionId]/Carousel";
import { fetchMissionDetail } from "../../market/data";
import AcceptedMissionDetailTable from "./AcceptedMissionDetailTable";
import EnterAnnoBtn from "./EnterAnnoBtn";
import { readFile } from "fs/promises";
import dynamic from "next/dynamic";
import { fetchUserMissionStatus } from "./data";
const DownloadInsFileBtn = dynamic(() => import("./DownloadInsFileBtn"), {
  ssr: false,
});

async function MyAcceptedDetailPage({
  params: { missionId },
}: {
  params: {
    missionId: string;
  };
}) {
  const mission = await fetchMissionDetail(missionId);
  if (!mission) {
    notFound();
  }
  const missionStatus = await fetchUserMissionStatus(missionId);

  var fileBuffer;
  if (mission.insFileName) {
    fileBuffer = await readFile(`app/api/insFiles/${mission.insFileName}`);
  }

  // const fileBuffer = await readFile(mission.insFilePath as PathLike);
  // console.log(fileBuffer);

  return (
    <>
      <h1 className={`${heading1Style} -ml-6 flex items-center gap-1`}>
        <Link
          href={"/dashboard/my-missions"}
          className="inline-block hover:text-v-success dark:hover:text-v-success-light"
        >
          <ArrowLeft size={38} />
        </Link>
        我的标注任务详情
      </h1>

      <div className="flex w-full">
        <AcceptedMissionDetailTable
          title={mission.title}
          updatedAt={mission.updatedAt || new Date()}
          reward={mission.reward}
          imagesLen={mission.images.length}
          status={missionStatus}
          description={mission.description || ""}
          comment={mission.comment || ""}
        />

        <div
          aria-label="image-gallery"
          className="ml-auto w-[560px] py-4 pl-20"
        >
          <Carousel
            imageUrls={mission.images.map(function getUrl(img) {
              return img.url;
            })}
          />
        </div>
      </div>

      <section
        aria-label="buttons"
        className="mt-16 flex items-center justify-center space-x-4"
      >
        {mission.insFileName && fileBuffer && (
          <DownloadInsFileBtn
            fileBufferJson={fileBuffer.toJSON()}
            filename={mission.insFileName.split("/").pop() ?? "instructions"}
          />
        )}
        {(missionStatus === "ONGOING" ||
          missionStatus === "PENDING_IMPROVE") && (
          <EnterAnnoBtn missionId={missionId} />
        )}
      </section>
    </>
  );
}

export default MyAcceptedDetailPage;
