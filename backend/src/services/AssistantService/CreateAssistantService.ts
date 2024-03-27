import AppError from "../../errors/AppError";
import Assistant from "../../models/Assistant";

const CreateAssistantService = async (data: Assistant) => {
    const isExistToUser = await Assistant.findOne({
        where: {
            userParentId: data.userParentId
        }
    })
    if (isExistToUser) {
        throw new AppError("ERR_ASSISTANT_ALREADY_EXISTS", 400)
    }
    return await Assistant.create(data)
}

export default CreateAssistantService;