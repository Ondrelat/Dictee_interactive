-- CreateTable
CREATE TABLE "descriptions" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "helperId" TEXT,
    "text" TEXT NOT NULL,

    CONSTRAINT "descriptions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "descriptions" ADD CONSTRAINT "descriptions_helperId_fkey" FOREIGN KEY ("helperId") REFERENCES "helper"("id") ON DELETE SET NULL ON UPDATE CASCADE;
