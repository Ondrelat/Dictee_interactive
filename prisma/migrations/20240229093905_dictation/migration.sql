-- CreateTable
CREATE TABLE "Dictation" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "audiour" TEXT NOT NULL,
    "audionam" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Dictation_id_key" ON "Dictation"("id");
