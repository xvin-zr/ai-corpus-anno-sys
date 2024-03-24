-- AlterTable
ALTER TABLE "Mission" ALTER COLUMN "multiRecipientEmails" SET DEFAULT ARRAY['_']::TEXT[];
