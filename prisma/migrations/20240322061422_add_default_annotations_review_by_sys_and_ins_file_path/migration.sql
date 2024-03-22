-- AlterTable
ALTER TABLE "Mission" ADD COLUMN     "insFilePath" TEXT,
ADD COLUMN     "multiRecipientEmails" TEXT[],
ADD COLUMN     "reviewBySystem" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "W3CAnnotation" ADD COLUMN     "defaultAnnotations" JSONB;
