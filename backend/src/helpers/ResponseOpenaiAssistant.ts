import { AiResponseCreator, AiResponse } from "./AiResponse";

export class ResponseOpenaiAssistant extends AiResponseCreator {
    public async createResponse(): Promise<AiResponse> {
        return {
            "action": "assistant",
            "message": "Hello, how can I help you?",
            tokensExpended: 0
        }
    }
}