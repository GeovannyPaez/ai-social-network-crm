import { AsisstanCreateData } from "../../@types/assistant";
import AppError from "../../errors/AppError";
import CryptoHelper from "../../helpers/CryptoHelper";
import Assistant from "../../models/Assistant";
import ShowAiModelService from "../AiModelServices/ShowAiModelService";


const CreateAssistantService = async (data: AsisstanCreateData) => {
    const isExistToUser = await Assistant.findOne({
        where: {
            userParentId: data.userParentId
        }
    })
    const model = ShowAiModelService(data.modelId);
    if (!model) {
        throw new AppError("ERR_MODEL_NOT_FOUND", 404)
    }
    if (isExistToUser) {
        throw new AppError("ERR_ASSISTANT_ALREADY_EXISTS", 400)
    }
    data.openaiApiKey = CryptoHelper.encrypt(data.openaiApiKey)
    return await Assistant.create(data)
}

export default CreateAssistantService;