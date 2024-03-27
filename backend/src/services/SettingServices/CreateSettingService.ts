import Setting from "../../models/Setting";

type Request = {
    openaiKey?: string;
    userParentId: number;
}
const CreateSettingService = async (data: Request): Promise<Setting> => {
    return await Setting.create(data)
}

export default CreateSettingService;