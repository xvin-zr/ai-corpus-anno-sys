-- CreateTable
CREATE TABLE "UserMission" (
    "missionId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "status" "MissionStatus" NOT NULL,

    CONSTRAINT "UserMission_pkey" PRIMARY KEY ("missionId","email")
);

-- AddForeignKey
ALTER TABLE "UserMission" ADD CONSTRAINT "UserMission_email_fkey" FOREIGN KEY ("email") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
