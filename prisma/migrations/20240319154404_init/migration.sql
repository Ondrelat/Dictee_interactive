/*
  Warnings:

  - You are about to drop the `descriptions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "descriptions" DROP CONSTRAINT "descriptions_helperId_fkey";

-- DropTable
DROP TABLE "descriptions";

-- CreateTable
CREATE TABLE "description" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "helperId" TEXT,
    "text" TEXT NOT NULL,

    CONSTRAINT "description_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "description" ADD CONSTRAINT "description_helperId_fkey" FOREIGN KEY ("helperId") REFERENCES "helper"("id") ON DELETE SET NULL ON UPDATE CASCADE;
