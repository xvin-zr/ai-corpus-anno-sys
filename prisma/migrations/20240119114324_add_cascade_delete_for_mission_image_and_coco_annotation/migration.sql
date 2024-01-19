-- DropForeignKey
ALTER TABLE "CocoAnnotation" DROP CONSTRAINT "CocoAnnotation_missionId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_cocoAnnotationId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_missionId_fkey";

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_cocoAnnotationId_fkey" FOREIGN KEY ("cocoAnnotationId") REFERENCES "CocoAnnotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CocoAnnotation" ADD CONSTRAINT "CocoAnnotation_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;
