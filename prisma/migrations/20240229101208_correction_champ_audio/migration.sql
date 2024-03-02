/*
  Warnings:

  - You are about to drop the column `audionam` on the `Dictation` table. All the data in the column will be lost.
  - You are about to drop the column `audiour` on the `Dictation` table. All the data in the column will be lost.
  - Added the required column `audioname` to the `Dictation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `audiourl` to the `Dictation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dictation" DROP COLUMN "audionam",
DROP COLUMN "audiour",
ADD COLUMN     "audioname" TEXT NOT NULL,
ADD COLUMN     "audiourl" TEXT NOT NULL;
