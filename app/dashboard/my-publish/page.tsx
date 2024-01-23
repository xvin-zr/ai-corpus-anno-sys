import React from "react";
import { heading1Style } from "../components/header.style";
import clsx from "clsx";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-option";
import prisma from "@/prisma/client";
import { MissionStatus } from "@prisma/client";
import StatusBadge from "../components/StatusBadge";

const missions = [
  {
    id: "1",
    title: "任务标题",
    createdAt: new Date(),
    reward: 100,
    status: "PENDING_ACCEPT",
  },
  {
    id: "2",
    title: "任务标题",
    createdAt: new Date(),
    reward: 100,
    status: "PENDING_ACCEPT",
  },
  {
    id: "3",
    title: "任务标题",
    createdAt: new Date(),
    reward: 100,
    status: "PENDING_ACCEPT",
  },
  {
    id: "4",
    title: "任务标题",
    createdAt: new Date(),
    reward: 100,
    status: "PENDING_ACCEPT",
  },
  {
    id: "5",
    title: "任务标题",
    createdAt: new Date(),
    reward: 100,
    status: "PENDING_ACCEPT",
  },
  {
    id: "6",
    title: "任务标题",
    createdAt: new Date(),
    reward: 100,
    status: "PENDING_ACCEPT",
  },
  {
    id: "7",
    title: "任务标题",
    createdAt: new Date(),
    reward: 100,
    status: "PENDING_ACCEPT",
  },
  {
    id: "8",
    title: "任务标题",
    createdAt: new Date(),
    reward: 100,
    status: "PENDING_ACCEPT",
  },
  {
    id: "9",
    title: "任务标题",
    createdAt: new Date(),
    reward: 100,
    status: "PENDING_ACCEPT",
  },
];

async function MyPublishPage() {
  const publishedMissions = await fetchPublishedMissions();

  return (
    <>
      <h1 className={heading1Style}>我发布的任务</h1>

      <StatusBadge status={"PENDING_ACCEPT"} />
      <StatusBadge status={"ONGOING"} />
      <StatusBadge status={"PENDING_REVIEW"} />
      <StatusBadge status={"PENDING_IMPROVE"} />
      <StatusBadge status={"COMPLETED"} />

      <section className="pb-10">
        <div className="relative mb-6 flex max-h-[544px] w-full flex-col overflow-auto rounded-xl bg-clip-border shadow-md dark:shadow-lg dark:shadow-zinc-700/50">
          <table className="w-full min-w-max table-auto text-left">
            <thead className="sticky top-0 font-medium dark:bg-zinc-700">
              <tr>
                <th className="px-4 py-5 first:rounded-tl-xl last:rounded-tr-xl">
                  <p className="block font-sans text-lg leading-none antialiased opacity-90">
                    任务标题
                  </p>
                </th>
                <th className="px-4 py-5 first:rounded-tl-xl last:rounded-tr-xl">
                  <p className="block font-sans text-lg leading-none antialiased opacity-90">
                    图片数量
                  </p>
                </th>
                <th className="p-4 first:rounded-tl-xl last:rounded-tr-xl">
                  <p className="block font-sans text-lg leading-none antialiased opacity-90">
                    创建时间
                  </p>
                </th>
                <th className="p-4 first:rounded-tl-xl last:rounded-tr-xl">
                  <p className="block font-sans text-lg leading-none antialiased opacity-90">
                    状态
                  </p>
                </th>
                <th className="p-4 first:rounded-tl-xl last:rounded-tr-xl">
                  <p className="block font-sans text-lg leading-none antialiased opacity-90"></p>
                </th>
              </tr>
            </thead>

            <tbody className="overflow-y-auto">
              {publishedMissions.length > 0 &&
                publishedMissions.map((mission) => (
                  <tr
                    key={mission.id}
                    className="border-b text-lg last:border-b-0 odd:bg-zinc-800/20 even:bg-zinc-700/30 dark:border-zinc-700"
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
                      {/* <p className="block font-normal leading-normal">
                        {mission.status}
                      </p> */}
                      <StatusBadge status={mission.status} />
                    </td>
                    <td className="p-4">
                      <Link
                        href={`/dashboard/market/${mission.id}`}
                        className="rounded-md px-2 py-1 text-base hover:bg-zinc-600/60"
                      >
                        详情
                      </Link>
                    </td>
                  </tr>
                ))}
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
    });
    if (!publishedMissions) return [];
    else return publishedMissions;
  } catch (err) {
    console.error(err);
    return [];
  }
}
