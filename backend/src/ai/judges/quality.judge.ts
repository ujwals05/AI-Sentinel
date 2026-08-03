import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { judgeLLM } from "../config/llm.config.js";

import {
    QUALITY_JUDGE_SYSTEM_PROMPT,
} from "../prompts/quality.prompt.js";

import {
    judgeParser,
} from "../core/judge.utils.js";

import type {
    EvaluationContext,
    JudgeResult,
} from "../core/judge.types.js";

export const runQualityJudge = async (
    context: EvaluationContext
): Promise<JudgeResult> => {

    const messages = context.messages
        .map(
            (message) =>
                `${message.role}: ${message.content}`
        )
        .join("\n");

    const formatInstructions =
        judgeParser.getFormatInstructions();

    const prompt = `
Conversation:

${messages}

Evaluate the final assistant response.

${formatInstructions}
`;

    const response = await judgeLLM.invoke([
        new SystemMessage(
            QUALITY_JUDGE_SYSTEM_PROMPT
        ),

        new HumanMessage(prompt),
    ]);

    const result =
        await judgeParser.parse(
            response.content.toString()
        );

    return {
        judge: "QUALITY",
        ...result,
    };
};