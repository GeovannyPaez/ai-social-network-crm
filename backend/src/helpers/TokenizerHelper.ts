import openaiTokenCounter, { ModelType } from "openai-gpt-token-counter"


export type MessageOpenAI = {
    role: "user" | "system" | "assistant";
    content: string;
};

export function CountMessagesTokens(messages: MessageOpenAI[], model: ModelType = "gpt-3.5-turbo"): number {
    const tokens = openaiTokenCounter.chat(messages, model)
    return tokens
}

export function CountMessageTokens(message: string, model: ModelType = "gpt-3.5-turbo"): number {
    const tokens = openaiTokenCounter.text(message, model)
    return tokens
}
