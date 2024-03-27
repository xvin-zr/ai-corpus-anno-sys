-- AlterTable
ALTER TABLE "Mission" ADD COLUMN     "rejectedCnt" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "UserAnnotation" ADD COLUMN     "bIoU" DOUBLE PRECISION;
