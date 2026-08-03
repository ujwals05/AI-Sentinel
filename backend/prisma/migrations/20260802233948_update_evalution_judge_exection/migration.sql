/*
  Warnings:

  - The values [BLOCK] on the enum `EvaluationDecision` will be removed. If these variants are still used in the database, this will fail.
  - The values [PROCESSING] on the enum `EvaluationStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [PROCESSING] on the enum `JudgeExecutionStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `updatedAt` on the `evaluations` table. All the data in the column will be lost.
  - You are about to drop the column `error` on the `judge_executions` table. All the data in the column will be lost.
  - You are about to drop the column `errorMessage` on the `judge_executions` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `judge_executions` table. All the data in the column will be lost.
  - You are about to drop the `judge_results` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EvaluationDecision_new" AS ENUM ('PASS', 'REVIEW', 'REJECT');
ALTER TABLE "evaluations" ALTER COLUMN "decision" TYPE "EvaluationDecision_new" USING ("decision"::text::"EvaluationDecision_new");
ALTER TYPE "EvaluationDecision" RENAME TO "EvaluationDecision_old";
ALTER TYPE "EvaluationDecision_new" RENAME TO "EvaluationDecision";
DROP TYPE "public"."EvaluationDecision_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "EvaluationStatus_new" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');
ALTER TABLE "public"."evaluations" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "evaluations" ALTER COLUMN "status" TYPE "EvaluationStatus_new" USING ("status"::text::"EvaluationStatus_new");
ALTER TYPE "EvaluationStatus" RENAME TO "EvaluationStatus_old";
ALTER TYPE "EvaluationStatus_new" RENAME TO "EvaluationStatus";
DROP TYPE "public"."EvaluationStatus_old";
ALTER TABLE "evaluations" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "JudgeExecutionStatus_new" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');
ALTER TABLE "public"."judge_executions" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "judge_executions" ALTER COLUMN "status" TYPE "JudgeExecutionStatus_new" USING ("status"::text::"JudgeExecutionStatus_new");
ALTER TYPE "JudgeExecutionStatus" RENAME TO "JudgeExecutionStatus_old";
ALTER TYPE "JudgeExecutionStatus_new" RENAME TO "JudgeExecutionStatus";
DROP TYPE "public"."JudgeExecutionStatus_old";
ALTER TABLE "judge_executions" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- DropForeignKey
ALTER TABLE "evaluations" DROP CONSTRAINT "evaluations_eventId_fkey";

-- DropForeignKey
ALTER TABLE "judge_results" DROP CONSTRAINT "judge_results_judgeExecutionId_fkey";

-- DropIndex
DROP INDEX "evaluations_decision_idx";

-- DropIndex
DROP INDEX "evaluations_eventId_idx";

-- DropIndex
DROP INDEX "evaluations_riskLevel_idx";

-- DropIndex
DROP INDEX "judge_executions_evaluationId_judgeType_key";

-- AlterTable
ALTER TABLE "evaluations" DROP COLUMN "updatedAt",
ALTER COLUMN "eventId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "judge_executions" DROP COLUMN "error",
DROP COLUMN "errorMessage",
DROP COLUMN "updatedAt",
ADD COLUMN     "latencyMs" INTEGER,
ADD COLUMN     "provider" TEXT,
ADD COLUMN     "reasoning" TEXT,
ADD COLUMN     "result" JSONB,
ADD COLUMN     "riskLevel" "RiskLevel",
ADD COLUMN     "score" DOUBLE PRECISION;

-- DropTable
DROP TABLE "judge_results";

-- DropEnum
DROP TYPE "EvaluationClassification";

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE CASCADE;
