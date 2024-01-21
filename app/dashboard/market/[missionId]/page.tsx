import prisma from "@/prisma/client";
import { heading1Style } from "../../components/header.style";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "react-feather";

async function MissionDetailPage({
  params: { missionId },
}: {
  params: { missionId: string };
}) {
  const mission = await fetchMissionDetail(missionId);
  if (!mission) {
    notFound();
  }

  return (
    <>
      <h1 className={`${heading1Style} -ml-6 flex items-center gap-1`}>
        <Link
          href={"/dashboard/market"}
          className="inline-block hover:text-blue-bupt dark:hover:text-v-success-light"
        >
          <ChevronLeft size={36} />
        </Link>
        任务详情
      </h1>

      <p>{mission.title}</p>
      <p>{mission.createdAt.toLocaleDateString("zh-CN")}</p>
      <p>{mission.reward?.toNumber()}</p>
      <p>{mission.description}</p>
      {mission.images.map((img) => (
        <p key={img.url}>{img.url}</p>
      ))}
    </>
  );
}

export default MissionDetailPage;

async function fetchMissionDetail(missionId: string) {
  try {
    const mission = await prisma.mission.findUnique({
      where: {
        id: missionId,
      },
      select: {
        title: true,
        createdAt: true,
        description: true,
        reward: true,
        images: {
          select: {
            url: true,
          },
        },
      },
    });

    return mission;
  } catch (err) {
    console.error(err);
    return null;
  }
}
