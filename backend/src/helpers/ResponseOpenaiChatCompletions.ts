import { getOpenAI } from "../libs/openai";
import { AiResponseCreator, AiResponse } from "./AiResponse";
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions";

type OpenAiChatCompletions = {
    model: ChatCompletionCreateParamsBase["model"];
    maxTokens: ChatCompletionCreateParamsBase["max_tokens"];
    messages: ChatCompletionCreateParamsBase["messages"];
    stream?: ChatCompletionCreateParamsBase["stream"];
};

export class ResponseOpenAiChatCompletions extends AiResponseCreator {
    private openaiKey: string;
    private openAiChatCompletions: OpenAiChatCompletions;

    constructor(openaiKey: string, openAiChatCompletions: OpenAiChatCompletions) {
        super();
        this.openaiKey = openaiKey;
        this.openAiChatCompletions = openAiChatCompletions;
    }

    public async createResponse(): Promise<AiResponse> {
        const openai = getOpenAI(this.openaiKey);

        const response = await openai.chat.completions.create({
            model: this.openAiChatCompletions.model,
            messages: this.openAiChatCompletions.messages,
            max_tokens: this.openAiChatCompletions.maxTokens,
        })
        const message = response.choices[0].message.content;
        const tokensExpended = response.usage?.total_tokens
        const action = "chat_completions";
        return { message, tokensExpended, action }
    }
}   