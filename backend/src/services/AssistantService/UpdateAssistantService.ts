import { UpdateAssistantData } from "../../@types/assistant";
import AppError from "../../errors/AppError";
import CryptoHelper from "../../helpers/CryptoHelper";
import Assistant from "../../models/Assistant";
import { ResponseOpenAiChatCompletions } from "../../helpers/ResponseOpenaiChatCompletions";
import GetAiResponse from "../../helpers/GetAiResponse";


const UpdateAssistanService = async (data: UpdateAssistantData) => {
    const assistant = await Assistant.findOne({
        where: {
            userParentId: data.userParentId,
            id: data.id
        }
    })
    if (!assistant) {
        throw new AppError("ERR_ASSISTANT_NOT_FOUND", 404)
    }

    if (data.isActivated) {
        const openaiApiKey = CryptoHelper.decrypt(assistant.openaiApiKey);
        const openAiChatCompletions = new ResponseOpenAiChatCompletions(openaiApiKey, {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: "Hello" }],
            maxTokens: assistant.maxTokens || 1000,
            instructions: assistant.instructions
        })
        await GetAiResponse(openAiChatCompletions)
    }

    if (data.openaiApiKey) {
        data.openaiApiKey = CryptoHelper.encrypt(data.openaiApiKey)
    }
    return await assistant.update(data)
}

export default UpdateAssistanService;