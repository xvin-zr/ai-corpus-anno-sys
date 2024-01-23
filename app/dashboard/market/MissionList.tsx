import prisma from "@/prisma/client";
import Image from "next/image";
import Link from "next/link";
import { MISSION_PAGE_SIZE } from "./page";

async function MissionList({
  query,
  currPage,
  totalPage,
}: {
  query: string;
  currPage: number;
  totalPage: number;
}) {
  const missions = await fetchFilteredMissions(query, currPage, totalPage);
  // const totalPage = Math.ceil(missions.length / MISSION_PAGE_SIZE);
  // console.log(missions);
  // console.log(totalPage);

  return (
    <ul className="grid grid-cols-4 grid-rows-2 gap-4">
      {missions.map((item) => (
        <li key={item.id} aria-label="mission-item">
          <Link
            href={`/dashboard/market/${item.id}`}
            className="flex h-56 cursor-pointer list-none flex-col divide-y divide-zinc-300 overflow-hidden rounded-lg border border-zinc-300 bg-transparent shadow transition-all hover:-translate-y-2 hover:shadow-md dark:divide-zinc-600 dark:border-zinc-600"
          >
            <figure
              aria-label="mission-cover"
              className="relative basis-7/12 overflow-hidden"
            >
              <Image
                src={item.coverUrl}
                fill
                sizes="100%"
                alt="mission cover"
                quality={50}
                priority
                className="object-cover"
              ></Image>
            </figure>

            <div className="basis-5/12 space-y-0.5 bg-zinc-100 p-3 dark:bg-zinc-800">
              <h2 className="text-lg font-medium">{item.title}</h2>
              <span className="flex items-center px-1">
                <span className="text-xl opacity-[0.85] ">
                  ¥&nbsp;{item.reward}
                </span>

                <time className="ml-auto mr-3 opacity-60" dateTime="">
                  {item.createdAt.toLocaleDateString("zh-CN")}
                </time>
              </span>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default MissionList;

interface MissionItem {
  id: string;
  title: string;
  coverUrl: string;
  reward: number;
  createdAt: Date;
}

async function fetchFilteredMissions(
  query: string,
  currPage: number,
  totalPage: number,
): Promise<MissionItem[]> {
  try {
    const missions = await prisma.mission.findMany({
      skip: (currPage - 1) * MISSION_PAGE_SIZE,
      take: MISSION_PAGE_SIZE,
      where: {
        title: {
          contains: query,
          mode: "insensitive",
        },
        status: "PENDING_ACCEPT",
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        reward: true,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return missions.map(function getItem(mission) {
      return {
        id: mission.id,
        title: mission.title,
        createdAt: mission.createdAt,
        reward: mission.reward?.toNumber() ?? NaN,
        coverUrl: mission.images[0].url,
      };
    });
  } catch (err) {
    console.error(err);
    return [];
  }
}
