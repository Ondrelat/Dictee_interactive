-- CreateTable
CREATE TABLE "Helper" (
    "id" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "GenerateType" TEXT NOT NULL,
    "NumberVote" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Word" (
    "id" TEXT NOT NULL,
    "Name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Helperword" (
    "id" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "helperId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Helper_id_key" ON "Helper"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Word_id_key" ON "Word"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Helperword_id_key" ON "Helperword"("id");

-- AddForeignKey
ALTER TABLE "Helperword" ADD CONSTRAINT "Helperword_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Helperword" ADD CONSTRAINT "Helperword_helperId_fkey" FOREIGN KEY ("helperId") REFERENCES "Helper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
