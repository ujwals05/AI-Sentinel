import {
    ChatGoogleGenerativeAI,
} from "@langchain/google-genai";
import { env } from "../../config/env.js";


export const judgeLLM =
    new ChatGoogleGenerativeAI({

        model:
            env.GEMINI_MODEL,

        temperature:
            env.GEMINI_TEMPERATURE,

        maxRetries:
            2,

        apiKey:
            env.GEMINI_API_KEY,
    });

export const judgeLLM_safety =
    new ChatGoogleGenerativeAI({

        model:
            env.GEMINI_MODEL,

        temperature:
            env.GEMINI_TEMPERATURE,

        maxRetries:
            2,

        apiKey:
            env.GEMINI_API_KEY_SAFETY,
    });

export const judgeLLM_quality =
    new ChatGoogleGenerativeAI({

        model:
            env.GEMINI_MODEL,

        temperature:
            env.GEMINI_TEMPERATURE,

        maxRetries:
            2,

        apiKey:
            env.GEMINI_API_KEY_QUALITY,
    });

export const judgeLLM_trust =
    new ChatGoogleGenerativeAI({

        model:
            env.GEMINI_MODEL,

        temperature:
            env.GEMINI_TEMPERATURE,

        maxRetries:
            2,

        apiKey:
            env.GEMINI_API_KEY_TRUST,
    });