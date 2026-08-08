import {
    findConversationForEvaluation,
    createEvaluation,
    updateEvaluation,
    createJudgeExecutions,
} from "./evaluation.repository.js";

import {
    runEvaluation,
} from "./evaluation.orchestrator.js";

import { findConversationById } from "../conversations/conversation.repository.js";
import { findEventById } from "../events/event.repository.js";
import { findMessagesByConversation } from "../messages/message.repository.js";

import type { EvaluationContext } from "./evaluation.types.js";

export const evaluateConversation = async (conversationId: string) => {
    // 1. Load conversation
    const conversation =
        await findConversationForEvaluation(
            conversationId
        );

    if (!conversation) {
        throw new Error(
            "Conversation not found"
        );
    }

    if (
        conversation.messages.length === 0
    ) {
        throw new Error(
            "Cannot evaluate an empty conversation"
        );
    }

    // 2. Build AI context
    const context = {
        applicationId:
            conversation.applicationId,

        conversationId:
            conversation.id,

        conversation: {
            externalId:
                conversation.externalId,

            title:
                conversation.title,
        },

        messages:
            conversation.messages.map(
                (message) => ({
                    role:
                        message.role,

                    content:
                        message.content,
                })
            ),
    };

    // 3. Run LangGraph
    const result =
        await runEvaluation(
            context
        );

    // 4. Return result
    return {
        conversationId,

        quality: result.quality,

        safety: result.safety,

        trust: result.trust,

        overallScore:
            result.overallScore,

        riskLevel:
            result.riskLevel,

        decision:
            result.decision,

        summary:
            result.summary,
    };
};

interface StartEvaluationInput {
    applicationId: string;
    conversationId: string;
    eventId: string;
}


export const startEvaluation = async (input: StartEvaluationInput) => {

    let evaluationId: string | undefined;

    try {

        const {
            applicationId,
            conversationId,
            eventId,
        } = input;


        console.log("[EVALUATION] startEvaluation called");

        // ----------------------------------
        // 1. Get Conversation
        // ----------------------------------

        const conversation =
            await findConversationById(
                conversationId
            );

        if (!conversation) {
            throw new Error(
                "Conversation not found"
            );
        }


        // ----------------------------------
        // 2. Verify Application Ownership
        // ----------------------------------

        if (
            conversation.applicationId !==
            applicationId
        ) {
            throw new Error(
                "Conversation does not belong to application"
            );
        }


        // ----------------------------------
        // 3. Get Messages
        // ----------------------------------

        const messages =
            await findMessagesByConversation(
                conversationId
            );


        // ----------------------------------
        // 4. Get Event
        // ----------------------------------

        const event =
            await findEventById(
                eventId
            );

        if (!event) {
            throw new Error(
                "Event not found"
            );
        }


        // ----------------------------------
        // 5. Verify Event Ownership
        // ----------------------------------

        if (
            event.applicationId !==
            applicationId
        ) {
            throw new Error(
                "Event does not belong to application"
            );
        }


        // ----------------------------------
        // 6. Build Evaluation Context
        // ----------------------------------

        console.log("[EVALUATION] Context loaded");

        const context: EvaluationContext = {
            applicationId,
            conversationId,
            eventId,
            conversation,
            messages,
            event,
        };


        // ----------------------------------
        // 7. Create Evaluation
        // ----------------------------------

        const evaluation = await createEvaluation({
            applicationId,
            conversationId,
            eventId,
            status: "PENDING",
            startedAt: new Date(),
        });

        evaluationId = evaluation.id;
        console.log(`[EVALUATION] Evaluation created: ${evaluationId}`);

        await updateEvaluation(evaluationId, {
            status: "RUNNING",
        });

        console.log("[EVALUATION] Status updated to RUNNING");


        // ----------------------------------
        // 8. Send to AI Evaluation Layer
        // ----------------------------------

        console.log("[EVALUATION] Starting LangGraph");

        const result =
            await runEvaluation(
                context
            );

        console.log("[AI] Quality judge completed");
        console.log("[AI] Safety judge completed");
        console.log("[AI] Trust judge completed");
        console.log("[AI] Aggregation completed");

        // ----------------------------------
        // 9. Persist Judge Results
        // ----------------------------------

        console.log("[EVALUATION] Persisting final result");

        if (result.quality && result.safety && result.trust) {
            const judgeExecutions = [
                {
                    evaluationId: evaluationId,
                    judgeType: "QUALITY" as const,
                    status: "COMPLETED" as const,
                    score: result.quality.score,
                    riskLevel: result.quality.riskLevel,
                    reasoning: result.quality.reasoning,
                    result: {
                        findings: result.quality.findings,
                        recommendations: result.quality.recommendations,
                        passed: result.quality.passed,
                    },
                    completedAt: new Date(),
                },
                {
                    evaluationId: evaluationId,
                    judgeType: "SAFETY" as const,
                    status: "COMPLETED" as const,
                    score: result.safety.score,
                    riskLevel: result.safety.riskLevel,
                    reasoning: result.safety.reasoning,
                    result: {
                        findings: result.safety.findings,
                        recommendations: result.safety.recommendations,
                        passed: result.safety.passed,
                    },
                    completedAt: new Date(),
                },
                {
                    evaluationId: evaluationId,
                    judgeType: "TRUST" as const,
                    status: "COMPLETED" as const,
                    score: result.trust.score,
                    riskLevel: result.trust.riskLevel,
                    reasoning: result.trust.reasoning,
                    result: {
                        findings: result.trust.findings,
                        recommendations: result.trust.recommendations,
                        passed: result.trust.passed,
                    },
                    completedAt: new Date(),
                }
            ];
            
            await createJudgeExecutions(judgeExecutions);
        }


        // ----------------------------------
        // 10. Update Evaluation Result
        // ----------------------------------

        console.log("[EVALUATION] Evaluation completed");
        console.log(`[EVALUATION] Evaluation ID: ${evaluationId}`);
        console.log("[EVALUATION] Final status: COMPLETED");

        await updateEvaluation(evaluationId, {
            status: "COMPLETED",
            overallScore: result.overallScore,
            riskLevel: result.riskLevel,
            decision: result.decision,
            summary: result.summary,
            completedAt: new Date(),
        });


        // ----------------------------------
        // 11. Return Evaluation Result
        // ----------------------------------

        return result;


    } catch (error) {

        console.error(
            "Evaluation failed:",
            error
        );

        if (evaluationId) {
            try {
                await updateEvaluation(evaluationId, {
                    status: "FAILED",
                    summary: error instanceof Error ? error.message : "Unknown error occurred",
                    completedAt: new Date(),
                });
                console.log(`[EVALUATION] Evaluation failed`);
                console.log(`[EVALUATION] evaluationId: ${evaluationId}`);
            } catch (updateError) {
                console.error("Failed to update evaluation status to FAILED:", updateError);
            }
        }

        throw error;
    }
};