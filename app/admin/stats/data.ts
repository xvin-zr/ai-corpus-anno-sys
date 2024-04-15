import { getCurrUserEmail } from "@/app/data";
import prisma from "@/prisma/client";

export async function fetchTotalUser(): Promise<
  {
    month: string;
    用户数量: number;
  }[]
> {
  const date = new Date();
  // 获取近 3 个月的用户总数
  try {
    const users = await prisma.user.findMany({
      select: {
        createdAt: true,
      },
    });

    const userCounts = []; // Initialize array to store user counts for each month

    date.setMonth(date.getMonth() + 1); // Move back one month for each iteration
    for (let i = 5; i >= 0; i--) {
      date.setMonth(date.getMonth() - 1); // Move back one month for each iteration

      const monthAgo = users.filter(
        ({ createdAt }) => createdAt.getTime() <= date.getTime(),
      ).length;

      //   userCounts[i] = monthAgo; // Store user count for the current month (i)
      userCounts.unshift({
        month: date.toLocaleString("default", { month: "numeric" }) + " 月",
        用户数量: monthAgo,
      });
    }

    return userCounts;
  } catch (err) {
    console.error(err);
    throw new Error("error in fetch total user");
  }
}

export async function fetchUserAccuracyDistribution() {
  try {
    const users = await prisma.user.findMany();
    const distribution = [];

    const lt0_5 = users.filter(({ accuracy }) => accuracy < 0.5).length;
    const bt0_5_0_8 = users.filter(
      ({ accuracy }) => accuracy >= 0.5 && accuracy < 0.8,
    ).length;
    const gt0_8 = users.filter(({ accuracy }) => accuracy >= 0.8).length;

    distribution.push({
      标注通过率: "小于 0.5",
      用户数量: lt0_5,
    });
    distribution.push({
      标注通过率: "0.5 - 0.8",
      用户数量: bt0_5_0_8,
    });
    distribution.push({
      标注通过率: "大于 0.8",
      用户数量: gt0_8,
    });

    return distribution;
  } catch (err) {
    console.error(err);
    throw new Error("error in fetch user accuracy distribution");
  }
}

export async function fetchTotalCompletedMissions() {
  try {
    const missions = await prisma.mission.findMany({
      where: {
        OR: [{ status: "COMPLETED" }, { passedCnt: { gt: 1 } }],
      },
      select: {
        createdAt: true,
      },
    });

    // 获取近 6 个月的完成任务总数
    const date = new Date();
    const missionCounts = [];

    date.setMonth(date.getMonth() + 1); // Move back one month for each iteration
    for (let i = 5; i >= 0; i--) {
      date.setMonth(date.getMonth() - 1); // Move back one month for each iteration

      const monthAgo = missions.filter(
        ({ createdAt }) => createdAt.getTime() <= date.getTime(),
      ).length;

      //   userCounts[i] = monthAgo; // Store user count for the current month (i)
      missionCounts.unshift({
        month: date.toLocaleString("default", { month: "numeric" }) + " 月",
        完成任务数量: monthAgo,
      });
    }
    return missionCounts;
  } catch (err) {
    console.error(err);
    throw new Error("error in fetch total completed missions");
  }
}

export async function fetchMissionCategories() {
  try {
    const missions = await prisma.mission.findMany({
      select: {
        mainCategories: true,
      },
    });

    const map = new Map();
    missions.forEach(({ mainCategories }) => {
      mainCategories.forEach((category) => {
        if (category == "_") return;
        map.set(category, (map.get(category) ?? 0) + 1);
      });
    });

    const categories: {
      类别: string;
      任务数量: number;
    }[] = [];
    map.forEach((value, key) => {
      categories.push({
        类别: key,
        任务数量: value,
      });
    });
    return categories;
  } catch (err) {
    console.error(err);
    throw new Error("error in fetch mission categories");
  }
}

export async function fetchMissionPassedRate() {
  // 分别获取系统审核和人工审核的通过率
  const date = new Date();
  try {
    const sysMissions = await prisma.mission.findMany({
      select: {
        passedCnt: true,
        recipientsCnt: true,
        createdAt: true,
      },
    });
    const humanMissions = await prisma.mission.findMany({
      where: {
        reviewBySystem: false,
      },
      select: {
        status: true,
        createdAt: true,
      },
    });

    const res = [];
    date.setMonth(date.getMonth() + 1);
    for (let i = 5; i >= 0; i--) {
      date.setMonth(date.getMonth() - 1);

      //   计算系统审核通过率
      const sysPassed = sysMissions.filter(
        ({ createdAt }) => createdAt.getTime() <= date.getTime(),
      );
      const sysPassedCnt = sysPassed.reduce(
        (acc, { passedCnt }) => acc + passedCnt,
        0,
      );
      const sysTotalCnt = sysPassed.reduce(
        (acc, { recipientsCnt }) => acc + recipientsCnt,
        0,
      );

      //   计算人工审核通过率
      const humanPassed = humanMissions.filter(
        ({ createdAt }) => createdAt.getTime() <= date.getTime(),
      );
      const humanPassedRate =
        humanPassed.filter(({ status }) => status == "COMPLETED").length /
        humanPassed.length;

      res.unshift({
        month: date.toLocaleString("default", { month: "numeric" }) + " 月",
        系统审核通过率: floatRound(sysPassedCnt / sysTotalCnt) || 0,
        人工审核通过率: floatRound(humanPassedRate) || 0,
      });
    }
    return res;
  } catch (err) {
    console.error(err);
    throw new Error("error in fetch mission passed rate");
  }
}

export async function fetchRewardCompleteTime() {
  // 获取不同类别的平均报酬和完成时间
  try {
    const missions = await prisma.mission.findMany({
      where: {
        status: "COMPLETED",
      },
      select: {
        createdAt: true,
        updatedAt: true,
        mainCategories: true,
        reward: true,
      },
    });

    const map = new Map<
      string,
      { cnt: number; totalTime: number; totalReward: number }
    >();
    missions.forEach(({ mainCategories, updatedAt, createdAt, reward }) => {
      for (const category of mainCategories) {
        if (category == "_") continue;
        const prev = map.get(category);
        map.set(category, {
          cnt: (prev?.cnt ?? 0) + 1,
          totalTime:
            (prev?.totalTime ?? 0) +
            ((updatedAt ?? new Date()).getTime() - createdAt.getTime()),
          totalReward: (prev?.totalReward ?? 0) + (reward?.toNumber() ?? 0),
        });
      }
    });

    const res: {
      类别: string;
      平均报酬: number;
      平均完成时间: number;
    }[] = [];
    map.forEach(({ cnt, totalTime, totalReward }, key) => {
      res.push({
        类别: key,
        平均报酬: floatRound(totalReward / cnt),
        平均完成时间: floatRound(totalTime / cnt),
      });
    });

    return res;
  } catch (err) {
    console.error(err);
    throw new Error("error in fetch reward complete time");
  }
}

function floatRound(num: number, fixed: number = 2) {
  return parseFloat(num.toFixed(fixed));
}

export async function checkIsAdmin(): Promise<boolean> {
  const userEmail = await getCurrUserEmail();
  try {
    const { isAdmin } = await prisma.user.findUniqueOrThrow({
      where: {
        email: userEmail,
      },
      select: {
        isAdmin: true,
      },
    });
    return isAdmin;
  } catch (err) {
    console.error(err);
    throw new Error("error in isAdmin");
  }
}
