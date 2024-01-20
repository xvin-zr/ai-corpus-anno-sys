/*
  Warnings:

  - You are about to drop the column `cocoAnnotationId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `imagesId` on the `Mission` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_cocoAnnotationId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "cocoAnnotationId";

-- AlterTable
ALTER TABLE "CocoAnnotation" ADD COLUMN     "categoriesIds" INTEGER[];

-- AlterTable
ALTER TABLE "Mission" DROP COLUMN "imagesId",
ADD COLUMN     "imagesIds" TEXT[];
