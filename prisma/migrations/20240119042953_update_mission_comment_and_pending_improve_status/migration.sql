/*
  Warnings:

  - The `reward` column on the `Mission` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
ALTER TYPE "MissionStatus" ADD VALUE 'PENDING_IMPROVE';

-- AlterTable
ALTER TABLE "Mission" ADD COLUMN     "comment" TEXT,
DROP COLUMN "reward",
ADD COLUMN     "reward" MONEY;
