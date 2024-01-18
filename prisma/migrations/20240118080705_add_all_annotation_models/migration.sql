-- CreateEnum
CREATE TYPE "MissionStatus" AS ENUM ('PENDING_ACCEPT', 'ONGOING', 'PENDING_REVIEW', 'COMPLETED');

-- CreateEnum
CREATE TYPE "Segmentation" AS ENUM ('RLE', 'POLYGON');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "balance" MONEY NOT NULL DEFAULT 0,
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Image" (
    "id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "filename" TEXT,
    "flickrUrl" TEXT,
    "cocoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "missionId" TEXT,
    "cocoAnnotationId" TEXT,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mission" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "cocoAnnotationId" TEXT NOT NULL,
    "publisherId" TEXT NOT NULL,
    "recipientId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "status" "MissionStatus" NOT NULL DEFAULT 'PENDING_ACCEPT',
    "reward" INTEGER,

    CONSTRAINT "Mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CocoAnnotation" (
    "id" TEXT NOT NULL,
    "missionId" TEXT NOT NULL,

    CONSTRAINT "CocoAnnotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "W3CAnnotation" (
    "id" TEXT NOT NULL,
    "w3cAnnotations" JSONB[],

    CONSTRAINT "W3CAnnotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Annotation" (
    "id" SERIAL NOT NULL,
    "imageId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "segmentation" "Segmentation" NOT NULL DEFAULT 'RLE',
    "area" DOUBLE PRECISION NOT NULL,
    "xMin" DOUBLE PRECISION NOT NULL,
    "yMin" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "isCrowd" BOOLEAN NOT NULL,
    "cocoAnnotationId" TEXT,
    "w3CAnnotationId" TEXT,

    CONSTRAINT "Annotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Info" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "version" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contributor" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "cocoAnnotationId" TEXT NOT NULL,

    CONSTRAINT "Info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL,
    "name" TEXT,
    "supercategory" TEXT,
    "cocoAnnotationId" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "License" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "url" TEXT,
    "cocoAnnotationId" TEXT,

    CONSTRAINT "License_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Statistic" (
    "missionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publisherId" TEXT NOT NULL,
    "recipientId" TEXT,
    "profit" MONEY NOT NULL,

    CONSTRAINT "Statistic_pkey" PRIMARY KEY ("missionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Image_url_key" ON "Image"("url");

-- CreateIndex
CREATE UNIQUE INDEX "CocoAnnotation_missionId_key" ON "CocoAnnotation"("missionId");

-- CreateIndex
CREATE UNIQUE INDEX "Info_cocoAnnotationId_key" ON "Info"("cocoAnnotationId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_cocoAnnotationId_fkey" FOREIGN KEY ("cocoAnnotationId") REFERENCES "CocoAnnotation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CocoAnnotation" ADD CONSTRAINT "CocoAnnotation_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "Mission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Annotation" ADD CONSTRAINT "Annotation_cocoAnnotationId_fkey" FOREIGN KEY ("cocoAnnotationId") REFERENCES "CocoAnnotation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Annotation" ADD CONSTRAINT "Annotation_w3CAnnotationId_fkey" FOREIGN KEY ("w3CAnnotationId") REFERENCES "W3CAnnotation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Info" ADD CONSTRAINT "Info_cocoAnnotationId_fkey" FOREIGN KEY ("cocoAnnotationId") REFERENCES "CocoAnnotation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_cocoAnnotationId_fkey" FOREIGN KEY ("cocoAnnotationId") REFERENCES "CocoAnnotation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "License" ADD CONSTRAINT "License_cocoAnnotationId_fkey" FOREIGN KEY ("cocoAnnotationId") REFERENCES "CocoAnnotation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
