import AiModel from "../../models/AiModel"

const ListAiModelsService = async () => {
    return AiModel.findAll()
}

export default ListAiModelsService;