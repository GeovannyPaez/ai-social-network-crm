import { UpdateAssistantData } from "../../@types/assistant";
import AppError from "../../errors/AppError";
import Assistant from "../../models/Assistant";


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


    return await assistant.update(data)
}

export default UpdateAssistanService;