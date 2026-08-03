import { prisma } from "../../lib/prisma.js";

import type {
    PlaygroundEvaluationInput,
    PlaygroundEvaluationResult,
} from "./playground.types.js";

import {
    runEvaluation,
} from "../evaluations/evaluation.orchestrator.js";

export const evaluatePlaygroundResponse = async (
    input: PlaygroundEvaluationInput
): Promise<PlaygroundEvaluationResult> => {

    const {
        applicationId,
        input: userInput,
        output,
        metadata,
    } = input;

    // 1. Verify application exists
    const application = await prisma.application.findUnique({
        where: {
            id: applicationId,
        },
    });

    if (!application) {
        throw new Error("Application not found");
    }

    // 2. Generate one conversation ID
    const conversationId = crypto.randomUUID();

    // 3. Generate one external conversation ID
    const externalConversationId =
        `playground-${crypto.randomUUID()}`;

    // 4. Generate event ID
    const eventId = crypto.randomUUID();

    // 5. Build evaluation context
    const evaluationContext = {
        applicationId,

        conversationId,

        conversation: {
            id: conversationId,
            applicationId,
            externalId: externalConversationId,
            title: "Playground Evaluation",
            metadata: metadata ?? null,
        },

        messages: [
            {
                id: crypto.randomUUID(),
                role: "USER",
                content: userInput,
                sequence: 1,
                metadata: null,
            },
            {
                id: crypto.randomUUID(),
                role: "ASSISTANT",
                content: output,
                sequence: 2,
                metadata: null,
            },
        ],

        event: {
            id: eventId,
            applicationId,
            conversationId,
            externalEventId:
                `playground-event-${crypto.randomUUID()}`,
            type: "LLM_RESPONSE",
            payload: {
                input: userInput,
                output,
            },
            metadata: metadata ?? null,
            occurredAt: new Date(),
        },
    };

    // 6. Run existing evaluation pipeline
    const result = await runEvaluation(
        evaluationContext
    );

    // 7. Return evaluation result
    return {
        applicationId,

        overallScore: result.overallScore,

        riskLevel: result.riskLevel,

        decision: result.decision,

        summary: result.summary,

        judges: {
            quality: result.quality,
            safety: result.safety,
            trust: result.trust,
        },
    };
};