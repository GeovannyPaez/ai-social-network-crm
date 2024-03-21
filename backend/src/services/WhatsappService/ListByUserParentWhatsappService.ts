import Queue from "../../models/Queue";
import User from "../../models/User";
import UserWhatsapp from "../../models/UserWhatsapp"
import Whatsapp from "../../models/Whatsapp";

const ListByUserParentWhatsappService = async (userId: number) => {
    const parentUser = await User.findByPk(userId);
    if (!parentUser) {
        throw new Error("User not found");
    }
    const parentUserId = parentUser.parentId || userId;

    const userWhatsapp = await UserWhatsapp.findAll({
        where: {
            userId: parentUserId
        },
        include: [
            {
                model: Whatsapp,
                as: "whatsapp",
                include: [
                    {
                        model: Queue,
                        as: "queues",
                        attributes: ["id", "name", "color"]
                    }
                ]
            }
        ]
    });
    const userWhatsappList = userWhatsapp?.map(userWhatsapp => userWhatsapp.whatsapp) || [];
    return userWhatsappList;

}

export default ListByUserParentWhatsappService;