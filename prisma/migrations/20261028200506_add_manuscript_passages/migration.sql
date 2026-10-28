-- CreateTable
CREATE TABLE "ManuscriptPassage" (
    "id" TEXT NOT NULL,
    "conceptId" TEXT NOT NULL,
    "sectionKey" TEXT NOT NULL,
    "sectionTitle" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "writtenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "visibility" "Visibility" NOT NULL DEFAULT 'PRIVATE',

    CONSTRAINT "ManuscriptPassage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ManuscriptPassage_conceptId_sectionKey_writtenAt_idx" ON "ManuscriptPassage"("conceptId", "sectionKey", "writtenAt");

-- CreateIndex
CREATE INDEX "ManuscriptPassage_conceptId_visibility_idx" ON "ManuscriptPassage"("conceptId", "visibility");

-- AddForeignKey
ALTER TABLE "ManuscriptPassage" ADD CONSTRAINT "ManuscriptPassage_conceptId_fkey" FOREIGN KEY ("conceptId") REFERENCES "Concept"("id") ON DELETE CASCADE ON UPDATE CASCADE;
