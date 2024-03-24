/*
  Warnings:

  - You are about to drop the column `w3cAnnotations` on the `W3CAnnotation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "W3CAnnotation" DROP COLUMN "w3cAnnotations";

-- CreateTable
CREATE TABLE "UserAnnotation" (
    "imageId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "w3cAnnotations" JSONB,
    "w3CAnnotationId" TEXT,

    CONSTRAINT "UserAnnotation_pkey" PRIMARY KEY ("imageId","email")
);

-- AddForeignKey
ALTER TABLE "UserAnnotation" ADD CONSTRAINT "UserAnnotation_w3CAnnotationId_fkey" FOREIGN KEY ("w3CAnnotationId") REFERENCES "W3CAnnotation"("imageId") ON DELETE SET NULL ON UPDATE CASCADE;
