/*
  Warnings:

  - You are about to drop the column `publisherId` on the `Mission` table. All the data in the column will be lost.
  - You are about to drop the column `recipientId` on the `Mission` table. All the data in the column will be lost.
  - Added the required column `publisherEmail` to the `Mission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mission" DROP COLUMN "publisherId",
DROP COLUMN "recipientId",
ADD COLUMN     "publisherEmail" TEXT NOT NULL,
ADD COLUMN     "recipientEmail" TEXT;
