import Setting from "../../models/Setting";

async function ShowSettingsService(userParentId: number) {
    const settings = await Setting.findOne({
        where: {
            userParentId
        }
    })
    return settings
}

export default ShowSettingsService;