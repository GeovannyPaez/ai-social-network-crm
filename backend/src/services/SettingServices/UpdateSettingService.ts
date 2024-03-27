import AppError from "../../errors/AppError";
import Setting from "../../models/Setting";

type Request = {
    openaiKey?: string;
    userParentId: number;
}

const UpdaterSettingService = async (data: Request) => {
    const setting = await Setting.findOne({
        where: {
            userParentId: data.userParentId
        }
    })
    if (!setting) {
        throw new AppError("ERR_SETTING_NOT_FOUND", 404)
    }
    return await setting.update(data)
}

export default UpdaterSettingService;