/*
  Warnings:

  - A unique constraint covering the columns `[participentId,gameId]` on the table `Guess` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Guess_participentId_gameId_key" ON "Guess"("participentId", "gameId");
