export abstract class AiResponseCreator {
    public abstract createResponse(): Promise<AiResponse>;

    public async getResponse(): Promise<AiResponse> {
        return await this.createResponse();
    }
}

export interface AiResponse {
    message: string | null;
    tokensExpended?: number;
    action: "chat_completions" | "assistant";
}