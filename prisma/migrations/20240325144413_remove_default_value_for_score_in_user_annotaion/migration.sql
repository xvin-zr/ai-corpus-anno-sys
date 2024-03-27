/*
  Warnings:

  - Made the column `score` on table `UserAnnotation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserAnnotation" ALTER COLUMN "score" SET NOT NULL,
ALTER COLUMN "score" DROP DEFAULT;
