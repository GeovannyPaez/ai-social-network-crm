import OpenAI from "openai";
import { getOpenAI } from "../libs/openai";
import { AiResponseCreator, AiResponse } from "./AiResponse";
import { ChatCompletion, ChatCompletionCreateParamsBase } from "openai/resources/chat/completions";
import { CountMessagesTokens, MessageOpenAI } from "./TokenizerHelper";
import { logger } from "../utils/logger";

type OpenAiChatCompletions = {
    model: ChatCompletionCreateParamsBase["model"];
    maxTokens: number;
    messages: ChatCompletionCreateParamsBase["messages"];
    instructions: string
};

export class ResponseOpenAiChatCompletions extends AiResponseCreator {
    private openAiChatCompletions: OpenAiChatCompletions;

    constructor(openAiChatCompletions: OpenAiChatCompletions) {
        super();
        this.openAiChatCompletions = openAiChatCompletions;
    }

    public async createResponse(): Promise<AiResponse> {
        try {
            const openai = getOpenAI();
            const response = await this.getChatCompletions(openai);
            const { message, tokensExpended } = this.extractResponseData(response);
            return { message, tokensExpended, action: "chat_completions" };
        } catch (error) {
            this.handlerOpenAIError(error);
            return { message: "", tokensExpended: 0, action: "chat_completions" };
        }
    }

    private async getChatCompletions(openai: OpenAI) {
        return openai.chat.completions.create({
            model: this.openAiChatCompletions.model,
            messages: this.joinStructionsWithMessages(),
            max_tokens: this.openAiChatCompletions.maxTokens,
        });
    }

    private extractResponseData(response: ChatCompletion): { message: string, tokensExpended: number } {
        const message = response.choices[0].message.content || "";
        const tokensExpended = response.usage?.total_tokens || 0;
        return { message, tokensExpended };
    }

    public async getStreamingResponse() {
        try {
            const openai = getOpenAI();
            return await this.getStreamingChatCompletions(openai);
        } catch (error) {
            this.handlerOpenAIError(error);
        }
    }

    private async getStreamingChatCompletions(openai: OpenAI) {
        return openai.chat.completions.create({
            model: this.openAiChatCompletions.model,
            messages: this.joinStructionsWithMessages(),
            max_tokens: this.openAiChatCompletions.maxTokens,
            stream: true
        });
    }

    private joinStructionsWithMessages(): ChatCompletionCreateParamsBase["messages"] {
        const messages = [
            {
                role: "system",
                content: this.openAiChatCompletions.instructions
            },
            ...this.openAiChatCompletions.messages
        ]
        const tokens = CountMessagesTokens(messages as MessageOpenAI[]);
        logger.info(`Tokens sends: ${tokens}`);
        if (tokens > 5000) {
            messages.slice(-10)
        }
        return messages as ChatCompletionCreateParamsBase["messages"];
    }

}
