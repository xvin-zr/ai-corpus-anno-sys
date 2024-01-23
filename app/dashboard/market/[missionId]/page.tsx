import { authOptions } from "@/app/api/auth/[...nextauth]/auth-option";
import prisma from "@/prisma/client";
import clsx from "clsx";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "react-feather";
import { heading1Style } from "../../components/header.style";
import AcceptMissionBtn from "./AcceptMissionBtn";
import Carousel from "./Carousel";

const tdStyle = clsx("border border-zinc-300 p-3 dark:border-zinc-600");
const trStyle = clsx("odd:dark:bg-zinc-800/50");

async function MissionDetailPage({
  params: { missionId },
}: {
  params: { missionId: string };
}) {
  const mission = await fetchMissionDetail(missionId);
  if (!mission) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    notFound();
  }
  const userEmail = session.user.email;
  console.log(userEmail);

  return (
    <>
      <h1 className={`${heading1Style} -ml-6 flex items-center gap-1`}>
        <Link
          href={"/dashboard/market"}
          className="inline-block hover:text-v-success dark:hover:text-v-success-light"
        >
          <ArrowLeft size={38} />
        </Link>
        任务详情
      </h1>

      <div className="flex w-full">
        <div className="overflow-hidden rounded-md border border-zinc-300 dark:border-zinc-600">
          <table className="max-w-md flex-none table-fixed border-collapse text-lg">
            <tbody className="">
              <tr className={trStyle}>
                <td className={[tdStyle, "border-l-0 border-t-0"].join(" ")}>
                  任务标题
                </td>
                <td className={[tdStyle, "border-r-0 border-t-0"].join(" ")}>
                  {mission.title}
                </td>
              </tr>
              <tr className={trStyle}>
                <td className={[tdStyle, "border-l-0"].join(" ")}>创建时间</td>
                <td className={[tdStyle, "border-r-0"].join(" ")}>
                  {mission.createdAt.toLocaleDateString("zh")}
                </td>
              </tr>
              <tr className={trStyle}>
                <td className={tdStyle + " border-l-0"}>报酬</td>
                <td className={[tdStyle, "border-r-0"].join(" ")}>
                  ¥&nbsp;{mission.reward?.toNumber()}
                </td>
              </tr>
              <tr className={trStyle}>
                <td className={tdStyle + " border-l-0"}>图片数量</td>
                <td className={[tdStyle, "border-r-0"].join(" ")}>
                  {mission.images.length}
                </td>
              </tr>
              <tr className={trStyle}>
                <td className={[tdStyle, "border-b-0 border-l-0"].join(" ")}>
                  描述
                </td>
                <td className={[tdStyle, "border-b-0 border-r-0"].join(" ")}>
                  <textarea
                    className="border-none bg-transparent p-0"
                    style={{ resize: "none" }}
                    cols={23}
                    rows={4}
                    maxLength={50}
                    defaultValue={mission.description || ""}
                    disabled
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

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

      <form className="mt-16 flex flex-col items-center justify-center gap-4">
        <AcceptMissionBtn
          userEmail={userEmail || ""}
          publisherEmail={mission.publisherEmail}
          missionId={missionId}
        />

        {userEmail == mission.publisherEmail && (
          <p className={clsx("opacity-60")}>无法接受自己发布的任务&nbsp;🤥</p>
        )}
      </form>
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
        publisherEmail: true,
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
