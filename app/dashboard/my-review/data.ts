import { getCurrUserEmail } from "@/app/data";
import prisma from "@/prisma/client";

export async function fetchMyReviewMissions() {
  try {
    const userEmail = await getCurrUserEmail();
    const missions = await prisma.mission.findMany({
      where: {
        OR: [
          {
            reviewerEmail: userEmail,
            status: "PENDING_REVIEW",
          },
          {
            reviewerEmail: null,
            publisherEmail: userEmail,
            status: "PENDING_REVIEW",
            reviewBySystem: false,
          },
        ],
      },
      select: {
        id: true,
        title: true,
        imagesIds: true,
        updatedAt: true,
      },
    });

    return missions ?? [];
  } catch (err) {
    console.error(err);
    throw new Error("failed to fetch my review missions");
  }
}
