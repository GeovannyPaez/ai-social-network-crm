import AppError from "../../errors/AppError";
import Assistant from "../../models/Assistant";

type Request = {
    id: number;
    userParentId: number;
    name: string;
    instructions: string;
    isActivated?: boolean;
    model: string;
    type: string;
    idAssistant?: string;
    maxTokens: number;
}

const UpateAssistantService = async (data: Request) => {
    const assistant = await Assistant.findOne({
        where: {
            userParentId: data.userParentId,
            id: data.id
        }
    })
    if (!assistant) {
        throw new AppError("ERR_ASSISTANT_NOT_FOUND", 404)
    }
    return await assistant.update(data)
}

export default UpateAssistantService;