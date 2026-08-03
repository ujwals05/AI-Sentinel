/*
  Warnings:

  - You are about to drop the column `classification` on the `judge_executions` table. All the data in the column will be lost.
  - You are about to drop the column `confidence` on the `judge_executions` table. All the data in the column will be lost.
  - You are about to drop the column `explanation` on the `judge_executions` table. All the data in the column will be lost.
  - You are about to drop the column `recommendation` on the `judge_executions` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `judge_executions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "judge_executions" DROP COLUMN "classification",
DROP COLUMN "confidence",
DROP COLUMN "explanation",
DROP COLUMN "recommendation",
DROP COLUMN "score",
ADD COLUMN     "model" TEXT;
