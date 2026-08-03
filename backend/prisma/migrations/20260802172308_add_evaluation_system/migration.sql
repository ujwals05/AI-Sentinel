-- CreateEnum
CREATE TYPE "EvaluationStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "JudgeType" AS ENUM ('QUALITY', 'SAFETY', 'TRUST');

-- CreateEnum
CREATE TYPE "JudgeExecutionStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "EvaluationDecision" AS ENUM ('PASS', 'REVIEW', 'BLOCK');

-- CreateEnum
CREATE TYPE "EvaluationClassification" AS ENUM ('PASS', 'FAIL', 'WARNING', 'NOT_APPLICABLE');

-- CreateTable
CREATE TABLE "evaluations" (
    "id" UUID NOT NULL,
    "applicationId" UUID NOT NULL,
    "conversationId" UUID NOT NULL,
    "eventId" UUID NOT NULL,
    "status" "EvaluationStatus" NOT NULL DEFAULT 'PENDING',
    "overallScore" DOUBLE PRECISION,
    "riskLevel" "RiskLevel",
    "decision" "EvaluationDecision",
    "summary" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "judge_executions" (
    "id" UUID NOT NULL,
    "evaluationId" UUID NOT NULL,
    "judgeType" "JudgeType" NOT NULL,
    "status" "JudgeExecutionStatus" NOT NULL DEFAULT 'PENDING',
    "score" DOUBLE PRECISION,
    "confidence" DOUBLE PRECISION,
    "classification" "EvaluationClassification",
    "explanation" TEXT,
    "recommendation" TEXT,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "judge_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "judge_results" (
    "id" UUID NOT NULL,
    "judgeExecutionId" UUID NOT NULL,
    "criterion" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "maxScore" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "passed" BOOLEAN NOT NULL,
    "explanation" TEXT,
    "confidence" DOUBLE PRECISION,
    "classification" "EvaluationClassification" NOT NULL,
    "recommendation" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "judge_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "evaluations_applicationId_idx" ON "evaluations"("applicationId");

-- CreateIndex
CREATE INDEX "evaluations_conversationId_idx" ON "evaluations"("conversationId");

-- CreateIndex
CREATE INDEX "evaluations_eventId_idx" ON "evaluations"("eventId");

-- CreateIndex
CREATE INDEX "evaluations_status_idx" ON "evaluations"("status");

-- CreateIndex
CREATE INDEX "evaluations_riskLevel_idx" ON "evaluations"("riskLevel");

-- CreateIndex
CREATE INDEX "evaluations_decision_idx" ON "evaluations"("decision");

-- CreateIndex
CREATE INDEX "evaluations_createdAt_idx" ON "evaluations"("createdAt");

-- CreateIndex
CREATE INDEX "judge_executions_evaluationId_idx" ON "judge_executions"("evaluationId");

-- CreateIndex
CREATE INDEX "judge_executions_judgeType_idx" ON "judge_executions"("judgeType");

-- CreateIndex
CREATE INDEX "judge_executions_status_idx" ON "judge_executions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "judge_executions_evaluationId_judgeType_key" ON "judge_executions"("evaluationId", "judgeType");

-- CreateIndex
CREATE INDEX "judge_results_judgeExecutionId_idx" ON "judge_results"("judgeExecutionId");

-- CreateIndex
CREATE INDEX "judge_results_criterion_idx" ON "judge_results"("criterion");

-- CreateIndex
CREATE INDEX "judge_results_passed_idx" ON "judge_results"("passed");

-- CreateIndex
CREATE INDEX "judge_results_classification_idx" ON "judge_results"("classification");

-- CreateIndex
CREATE UNIQUE INDEX "judge_results_judgeExecutionId_criterion_key" ON "judge_results"("judgeExecutionId", "criterion");

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "judge_executions" ADD CONSTRAINT "judge_executions_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "evaluations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "judge_results" ADD CONSTRAINT "judge_results_judgeExecutionId_fkey" FOREIGN KEY ("judgeExecutionId") REFERENCES "judge_executions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
