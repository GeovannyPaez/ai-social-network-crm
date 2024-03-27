import AppError from "../../errors/AppError"
import Assistant from "../../models/Assistant"

const DeleteAssistantService = async (id: string) => {
    const assistant = await Assistant.findOne({
        where: {
            id
        }
    })
    if (!assistant) {
        throw new AppError("ERR_ASSISTANT_NOT_FOUND", 404)
    }
    return await assistant.destroy()
}

export default DeleteAssistantService;