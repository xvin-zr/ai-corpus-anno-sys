/*
  Warnings:

  - A unique constraint covering the columns `[imageId]` on the table `W3CAnnotation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `imageId` to the `W3CAnnotation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "W3CAnnotation" ADD COLUMN     "imageId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "W3CAnnotation_imageId_key" ON "W3CAnnotation"("imageId");
