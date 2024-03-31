export type AsisstanCreateData = {
    userParentId: number;
    name: string;
    instructions: string;
    isActivated?: boolean;
    modelId: number;
    maxTokens?: number;
    idAssistant?: string;
    openaiApiKey: string;
    userParentId: number;
    type: AssistantType;
}

export type UpdateAssistantData = {
    name?: string;
    instructions?: string;
    isActivated?: boolean;
    modeId?: number;
    type?: AssistantType;
    idAssistant?: string;
    maxTokens?: number;
    openaiApiKey?: string;
    userParentId: number;
    id: number;
}
export type AssistantType = "chat_completions" | "assistant"