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

export const dynamic = "force-dynamic";

async function AdminStatisticsPage() {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin) notFound();

  const totalUsers = await fetchTotalUser();
  const userAccuracy = await fetchUserAccuracyDistribution();
  const completedMissions = await fetchTotalCompletedMissions();
  const categories = await fetchMissionCategories();
  const missionPassedRate = await fetchMissionPassedRate();
  const rewardCompleteTime = await fetchRewardCompleteTime();

  return (
    <section className="grid grid-cols-2 gap-4">
      <div>
        <TotalUser totalUsers={totalUsers} />
      </div>

      <div>
        <UserAccuracy userAccuracy={userAccuracy} />
      </div>

      <div>
        <CompletedMission completedMissions={completedMissions} />
      </div>

      <div>
        <MissionCategories categories={categories} />
      </div>

      <div>
        <MissionPassedRate passedRate={missionPassedRate} />
      </div>

      <div>
        <RewardCompleteTime rewardCompleteTime={rewardCompleteTime} />
      </div>
    </section>
  );
}

export default AdminStatisticsPage;
