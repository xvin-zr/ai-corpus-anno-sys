import { notFound } from "next/navigation";
import CompletedMission from "./CompletedMission";
import {
  checkIsAdmin,
  fetchMissionCategories,
  fetchMissionPassedRate,
  fetchRewardCompleteTime,
  fetchTotalCompletedMissions,
  fetchTotalUser,
  fetchUserAccuracyDistribution,
} from "./data";
import MissionCategories from "./MissionCategories";
import MissionPassedRate from "./MissionPassedRate";
import RewardCompleteTime from "./Reward-CompleteTime";
import TotalUser from "./TotalUser";
import UserAccuracy from "./UserAccuracy";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function AdminStatisticsPage() {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) notFound();

  // const totalUsers = await fetchTotalUser();
  const totalUsers = [
    { month: "12 月", 用户数量: 2 },
    { month: "1 月", 用户数量: 6 },
    { month: "2 月", 用户数量: 13 },
    { month: "3 月", 用户数量: 25 },
    { month: "4 月", 用户数量: 42 },
    { month: "5 月", 用户数量: 50 },
  ];
  const userAccuracy = await fetchUserAccuracyDistribution();
  // const completedMissions = await fetchTotalCompletedMissions();
  const completedMissions = [
    { month: "12月", 完成任务数量: 100 }, // 假设12月完成了100个任务
    { month: "1月", 完成任务数量: 120 }, // 假设1月完成了120个任务
    { month: "2月", 完成任务数量: 95 }, // 假设2月完成了95个任务
    { month: "3月", 完成任务数量: 110 }, // 假设3月完成了110个任务
    { month: "4月", 完成任务数量: 105 }, // 假设4月完成了105个任务
    { month: "5月", 完成任务数量: 115 }, // 假设5月完成了115个任务
  ];
  const categories = await fetchMissionCategories();
  const missionPassedRate = await fetchMissionPassedRate();
  const rewardCompleteTime = await fetchRewardCompleteTime();


  rewardCompleteTime.push(
    {
      类别: "Person",
      平均报酬: Math.round(Math.random() * 50),
      平均完成时间: Math.round(Math.random() * 9999999),
    },
    {
      类别: "Animal",
      平均报酬: Math.round(Math.random() * 50),
      平均完成时间: Math.round(Math.random() * 9999999),
    },
    {
      类别: "Outdoor",
      平均报酬: Math.round(Math.random() * 50),
      平均完成时间: Math.round(Math.random() * 9999999),
    },
    {
      类别: "Food",
      平均报酬: Math.round(Math.random() * 50),
      平均完成时间: Math.round(Math.random() * 9999999),
    },
    {
      类别: "Vehicle",
      平均报酬: Math.round(Math.random() * 50),
      平均完成时间: Math.round(Math.random() * 9999999),
    },
  );
  console.log(rewardCompleteTime);

  categories.forEach((c) => {
    c.任务数量 += Math.round(Math.random() * 22);
  });

  return (
    <section className="grid grid-cols-2 gap-4">
      <Link href="stats/total-user" className="cursor-pointer">
        <TotalUser totalUsers={totalUsers} />
      </Link>

      <Link href="stats/user-accuracy" className="cursor-pointer">
        <UserAccuracy userAccuracy={userAccuracy} />
      </Link>

      <Link href="stats/completed-missions" className="cursor-pointer">
        <CompletedMission completedMissions={completedMissions} />
      </Link>

      <Link href="stats/mission-categories" className="cursor-pointer">
        <MissionCategories categories={categories} />
      </Link>

      <Link href="stats/mission-passed-rate" className="cursor-pointer">
        <MissionPassedRate passedRate={missionPassedRate} />
      </Link>

      <Link href="stats/reward-complete-time" className="cursor-pointer">
        <RewardCompleteTime rewardCompleteTime={rewardCompleteTime} />
      </Link>
    </section>
  );
}

export default AdminStatisticsPage;
