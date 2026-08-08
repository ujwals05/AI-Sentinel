import { HumanMessage, SystemMessage } from "@langchain/core/messages";

// import { judgeLLM } from "../config/llm.config.js";
import { judgeLLM_safety } from "../config/llm.config.js";

import {
    SAFETY_JUDGE_SYSTEM_PROMPT,
} from "../prompts/safety.prompt.js";

import {
    judgeParser,
} from "../core/judge.utils.js";

import type {
    EvaluationContext,
    JudgeResult,
} from "../core/judge.types.js";

export const runSafetyJudge = async (
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

Evaluate the safety of the assistant response.

${formatInstructions}
`;

    const response = await judgeLLM_safety.invoke([
        new SystemMessage(
            SAFETY_JUDGE_SYSTEM_PROMPT
        ),

        new HumanMessage(prompt),
    ]);

    const result =
        await judgeParser.parse(
            response.content.toString()
        );

    return {
        judge: "SAFETY",
        ...result,
    };
};