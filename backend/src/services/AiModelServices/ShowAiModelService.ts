import AiModel from "../../models/AiModel"

const ShowAiModelService = async (id: number) => {
    return AiModel.findByPk(id)
}

export default ShowAiModelService;