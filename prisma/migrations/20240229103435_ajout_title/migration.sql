/*
  Warnings:

  - Added the required column `title` to the `Dictation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dictation" ADD COLUMN     "title" TEXT NOT NULL;
