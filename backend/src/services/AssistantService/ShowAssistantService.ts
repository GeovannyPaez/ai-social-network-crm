import Assistant from "../../models/Assistant";

async function ShowAssistantService(userParentId: number) {
    const asssitant = await Assistant.findOne({
        where: {
            userParentId
        }
    })
    return asssitant
}


export default ShowAssistantService;