import Assistant from "../../models/Assistant";

const ListAssistantsService = async (parentId: number) => {
    return await Assistant.findAll({
        where: {
            userParentId: parentId
        }
    })
};

export default ListAssistantsService;