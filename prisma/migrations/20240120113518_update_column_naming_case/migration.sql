/*
  Warnings:

  - You are about to drop the column `w3CAnnotationId` on the `Annotation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Annotation" DROP CONSTRAINT "Annotation_cocoAnnotationId_fkey";

-- DropForeignKey
ALTER TABLE "Annotation" DROP CONSTRAINT "Annotation_w3CAnnotationId_fkey";

-- DropForeignKey
ALTER TABLE "License" DROP CONSTRAINT "License_cocoAnnotationId_fkey";

-- AlterTable
ALTER TABLE "Annotation" DROP COLUMN "w3CAnnotationId",
ADD COLUMN     "w3cAnnotationId" TEXT;

-- AddForeignKey
ALTER TABLE "Annotation" ADD CONSTRAINT "Annotation_cocoAnnotationId_fkey" FOREIGN KEY ("cocoAnnotationId") REFERENCES "CocoAnnotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Annotation" ADD CONSTRAINT "Annotation_w3cAnnotationId_fkey" FOREIGN KEY ("w3cAnnotationId") REFERENCES "W3CAnnotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "License" ADD CONSTRAINT "License_cocoAnnotationId_fkey" FOREIGN KEY ("cocoAnnotationId") REFERENCES "CocoAnnotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
