import OpenAI from "openai";
import AppError from "../errors/AppError";

export abstract class AiResponseCreator {
    public abstract createResponse(): Promise<AiResponse>;

    public async getResponse(): Promise<AiResponse> {
        return await this.createResponse();
    }
    public handlerOpenAIError(error: unknown) {
        if (error instanceof OpenAI.APIError) {
            if (error.status == 401) {
                throw new AppError("ERR_OPENAI_API_INVALID", 400)
            }
            if (error.status == 403) {
                throw new AppError("ERR_OPENAI_PERMISSION_DENIED", 403)
            }
            if (error.status == 400) {
                throw new AppError("ERR_OPENAI_API_BAD_REQUEST", 400)
            }
            if (error.status == 429) {
                throw new AppError("ERR_OPENAI_API_LIMIT", 429)
            }
            throw new AppError(error.type || "OPENAI_API_ERROR", error.status)
        }
        throw new AppError("UNKNOWN_ERROR")
    }
}

export interface AiResponse {
    message: string | null;
    tokensExpended?: number;
    action: "chat_completions" | "assistant";
}