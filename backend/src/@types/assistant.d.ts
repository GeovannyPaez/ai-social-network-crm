export type AsisstanCreateData = {
    userParentId: number;
    name: string;
    instructions: string;
    isActivate?: boolean;
    modelId: number;
    maxTokens?: number;
    idAssistant?: string;
    userParentId: number;
    type: AssistantType;
}

export type UpdateAssistantData = {
    name?: string;
    instructions?: string;
    isActivate?: boolean;
    modeId?: number;
    type?: AssistantType;
    idAssistant?: string;
    maxTokens?: number;
    userParentId: number;
    id: number;
}
export type AssistantType = "chat_completions" | "assistant"