import { authOptions } from "@/app/api/auth/[...nextauth]/auth-option";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "react-feather";
import { heading1Style } from "../../components/header.style";
import Carousel from "../../market/[missionId]/Carousel";
import { fetchMissionDetail } from "../../market/data";
import DeleteMissionBtn from "./DeleteMissionBtn";
import PublishedMissionDetailTable from "./PublishedMissionDetailTable";
import ReviewMissionBtn from "./ReviewMissionBtn";

async function MyPublishedDetailPage({
  params: { missionId },
}: {
  params: { missionId: string };
}) {
  const mission = await fetchMissionDetail(missionId);
  if (!mission) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) {
    notFound();
  }

  return (
    <>
      <h1 className={`${heading1Style} -ml-6 flex items-center gap-1`}>
        <Link
          href={"/dashboard/my-publish"}
          className="inline-block hover:text-v-success dark:hover:text-v-success-light"
        >
          <ArrowLeft size={38} />
        </Link>
        发布任务详情
      </h1>

      <div className="flex w-full">
        <PublishedMissionDetailTable
          title={mission.title}
          createdAt={mission.createdAt}
          reward={mission.reward}
          imagesLen={mission.images.length}
          status={mission.status}
          description={mission.description || ""}
          multiRecipientEmails={mission.multiRecipientEmails}
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

      {/* feature: 在一段时间未完成后允许删除 */}
      <section
        aria-label="buttons"
        className="mt-16 flex items-center justify-center gap-6"
      >
        {mission.status == "PENDING_ACCEPT" && (
          <DeleteMissionBtn missionId={missionId} />
        )}
        {/* <CompleteMissionBtn /> */}

        {mission.status == "PENDING_REVIEW" && (
          <ReviewMissionBtn missionId={missionId} />
        )}

        {mission.status == "COMPLETED" && <Link href={`#`}>下载标注语料</Link>}
      </section>
    </>
  );
}

export default MyPublishedDetailPage;
