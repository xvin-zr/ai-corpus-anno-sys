/*
  Warnings:

  - The `w3cAnnotations` column on the `W3CAnnotation` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "W3CAnnotation" DROP COLUMN "w3cAnnotations",
ADD COLUMN     "w3cAnnotations" JSONB;
