import { notFound } from "next/navigation";
import {
  fetchMissionCategories,
  fetchMissionPassedRate,
  fetchRewardCompleteTime,
  fetchTotalCompletedMissions,
  fetchTotalUser,
  fetchUserAccuracyDistribution,
} from "../data";
import TotalUser from "../TotalUser";
import UserAccuracy from "../UserAccuracy";
import CompletedMission from "../CompletedMission";
import MissionCategories from "../MissionCategories";
import MissionPassedRate from "../MissionPassedRate";
import RewardCompleteTime from "../Reward-CompleteTime";
import { fetchDataReport } from "./gemini";
// import { fetchDataReport } from "./kimi";

async function AdminStatisticDetailPage({
  params,
}: {
  params?: {
    chartName: string;
  };
}) {
  const chartName = params?.chartName ?? "total-user";

  var Chart;
  var report: undefined | string;
  switch (chartName) {
    case "total-user":
      // const totalUsers = await fetchTotalUser();
      const totalUsers = [
        { month: '12 月', 用户数量: 2 },
        { month: '1 月', 用户数量: 6 },
        { month: '2 月', 用户数量: 13 },
        { month: '3 月', 用户数量: 25 },
        { month: '4 月', 用户数量: 42 },
        { month: '5 月', 用户数量: 50 }
      ];
      Chart = <TotalUser totalUsers={totalUsers} />;
      report = await fetchDataReport(chartName, JSON.stringify(totalUsers));
      break;
    case "user-accuracy":
      const userAccuracy = await fetchUserAccuracyDistribution();
      Chart = <UserAccuracy userAccuracy={userAccuracy} />;
      report = await fetchDataReport(chartName, JSON.stringify(userAccuracy));
      break;
    case "completed-missions":
      const completedMissions = await fetchTotalCompletedMissions();
      Chart = <CompletedMission completedMissions={completedMissions} />;
      report = await fetchDataReport(
        chartName,
        JSON.stringify(completedMissions),
      );
      break;
    case "mission-categories":
      const categories = await fetchMissionCategories();
      Chart = <MissionCategories categories={categories} />;
      report = await fetchDataReport(chartName, JSON.stringify(categories));
      break;
    case "mission-passed-rate":
      const missionPassedRate = await fetchMissionPassedRate();
      Chart = <MissionPassedRate passedRate={missionPassedRate} />;
      report = await fetchDataReport(
        chartName,
        JSON.stringify(missionPassedRate),
      );
      break;
    case "reward-complete-time":
      const rewardCompleteTime = await fetchRewardCompleteTime();
      Chart = <RewardCompleteTime rewardCompleteTime={rewardCompleteTime} />;
      report = await fetchDataReport(
        chartName,
        JSON.stringify(rewardCompleteTime),
      );
      break;
    default:
      notFound();
  }

  return (
    <>
      {Chart}
      <div className="m-auto mt-6 w-1/2 pb-4 text-lg leading-relaxed">
        {report?.split("\n").map((line, index) => {
          if (line.endsWith("。**")) {
            return (
              <h3 key={index} className="my-1 text-lg font-semibold">
                {line.replaceAll("*", "")}
              </h3>
            );
          } else if (line.endsWith("**")) {
            return (
              <h2 key={index} className="my-1 text-xl font-semibold">
                {line.replaceAll("*", "")}
              </h2>
            );
          } else if (line.startsWith("* ")) {
            return <p key={index}>{line.replace("*", "-")}</p>;
          } else {
            return <p key={index}>{line.replaceAll("*", "")}</p>;
          }
        })}
      </div>
    </>
  );
}

export default AdminStatisticDetailPage;
