-- DropForeignKey
ALTER TABLE "Info" DROP CONSTRAINT "Info_cocoAnnotationId_fkey";

-- AddForeignKey
ALTER TABLE "Info" ADD CONSTRAINT "Info_cocoAnnotationId_fkey" FOREIGN KEY ("cocoAnnotationId") REFERENCES "CocoAnnotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
