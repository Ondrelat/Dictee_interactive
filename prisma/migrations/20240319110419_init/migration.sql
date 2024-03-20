/*
  Warnings:

  - You are about to drop the `Dictation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Helper` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Helperword` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Word` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Helperword" DROP CONSTRAINT "Helperword_helperId_fkey";

-- DropForeignKey
ALTER TABLE "Helperword" DROP CONSTRAINT "Helperword_wordId_fkey";

-- DropTable
DROP TABLE "Dictation";

-- DropTable
DROP TABLE "Helper";

-- DropTable
DROP TABLE "Helperword";

-- DropTable
DROP TABLE "Word";

-- CreateTable
CREATE TABLE "dictation" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "audio_url" TEXT NOT NULL,
    "audio_name" TEXT NOT NULL,

    CONSTRAINT "dictation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "helper" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "generate_type" TEXT NOT NULL,
    "number_vote" INTEGER NOT NULL,

    CONSTRAINT "helper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "word" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "helper_word" (
    "id" TEXT NOT NULL,
    "word_id" TEXT NOT NULL,
    "helper_id" TEXT NOT NULL,

    CONSTRAINT "helper_word_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dictation_title_key" ON "dictation"("title");

-- CreateIndex
CREATE UNIQUE INDEX "helper_title_key" ON "helper"("title");

-- CreateIndex
CREATE UNIQUE INDEX "word_name_key" ON "word"("name");

-- AddForeignKey
ALTER TABLE "helper_word" ADD CONSTRAINT "helper_word_word_id_fkey" FOREIGN KEY ("word_id") REFERENCES "word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "helper_word" ADD CONSTRAINT "helper_word_helper_id_fkey" FOREIGN KEY ("helper_id") REFERENCES "helper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
