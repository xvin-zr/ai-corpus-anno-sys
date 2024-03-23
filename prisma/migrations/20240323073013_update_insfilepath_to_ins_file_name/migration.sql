/*
  Warnings:

  - You are about to drop the column `insFilePath` on the `Mission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Mission" DROP COLUMN "insFilePath",
ADD COLUMN     "insFileName" TEXT;
