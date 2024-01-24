import { authOptions } from "@/app/api/auth/[...nextauth]/auth-option";
import prisma from "@/prisma/client";
import { MissionStatus } from "@prisma/client";
import { getServerSession } from "next-auth";
import Link from "next/link";
import StatusBadge from "../components/StatusBadge";
import { heading1Style } from "../components/header.style";

async function MyPublishPage() {
  const publishedMissions: PublishedMission[] = await fetchPublishedMissions();

  return (
    <>
      <h1 className={heading1Style}>我发布的任务</h1>

      <section className="pb-10">
        <div className="relative mb-6 flex max-h-[544px] w-full flex-col overflow-auto rounded-xl bg-clip-border shadow-md dark:shadow-lg dark:shadow-zinc-700/40">
          <table className="w-full min-w-max table-auto text-left">
            <thead className="sticky top-0 bg-zinc-300 font-medium dark:bg-zinc-700">
              <tr>
                <th className="px-4 py-5 first:rounded-tl-xl last:rounded-tr-xl">
                  <p className="block font-sans text-lg leading-none antialiased opacity-50 dark:opacity-90">
                    任务标题
                  </p>
                </th>
                <th className="px-4 py-5 first:rounded-tl-xl last:rounded-tr-xl">
                  <p className="block font-sans text-lg leading-none antialiased opacity-50 dark:opacity-90">
                    图片数量
                  </p>
                </th>
                <th className="p-4 first:rounded-tl-xl last:rounded-tr-xl">
                  <p className="block font-sans text-lg leading-none antialiased opacity-50 dark:opacity-90">
                    创建时间
                  </p>
                </th>
                <th className="p-4 first:rounded-tl-xl last:rounded-tr-xl">
                  <p className="block font-sans text-lg leading-none antialiased opacity-50 dark:opacity-90">
                    状态
                  </p>
                </th>
                <th className="p-4 first:rounded-tl-xl last:rounded-tr-xl">
                  <p className="block font-sans text-lg leading-none antialiased opacity-50 dark:opacity-90"></p>
                </th>
              </tr>
            </thead>

            <tbody className="overflow-y-auto">
              {publishedMissions.length > 0 &&
                publishedMissions.map((mission) => (
                  <tr
                    key={mission.id}
                    className="daek:odd:bg-zinc-800/20 border-b border-zinc-300 text-lg last:border-b-0 even:bg-zinc-100 dark:border-zinc-700 dark:even:bg-zinc-700/30"
                  >
                    <td className="p-4">
                      <p className="block font-normal leading-normal">
                        {mission.title}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="block font-normal leading-normal">
                        {mission.imagesIds.length}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="block font-normal leading-normal">
                        {mission.createdAt.toLocaleString("zh", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={mission.status} />
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/dashboard/my-publish/${mission.id}`}
                        className="rounded-md px-2 py-1 text-base hover:bg-zinc-200/70 dark:hover:bg-zinc-600/60"
                      >
                        详情
                      </Link>
                    </td>
                  </tr>
                ))}

              {publishedMissions.length == 0 && (
                <tr className="text-center">
                  <td colSpan={5} className="py-4 text-xl">
                    没有发布的任务&nbsp;😓
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export default MyPublishPage;

interface PublishedMission {
  id: string;
  title: string;
  imagesIds: string[];
  createdAt: Date;
  status: MissionStatus;
}

async function fetchPublishedMissions(): Promise<PublishedMission[]> {
  const session = await getServerSession(authOptions);
  const userEmail = session?.user?.email;
  if (!userEmail) return [];

  try {
    const publishedMissions = await prisma.mission.findMany({
      where: {
        publisherEmail: userEmail,
      },
      select: {
        id: true,
        title: true,
        imagesIds: true,
        createdAt: true,
        status: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!publishedMissions) return [];
    else return publishedMissions;
  } catch (err) {
    console.error(err);
    return [];
  }
}
