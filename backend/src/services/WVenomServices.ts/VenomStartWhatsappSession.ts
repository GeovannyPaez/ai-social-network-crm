import { initWbot } from "../../libs/venom-bot";
import Whatsapp from "../../models/Whatsapp";
import { venomWhatsappListener } from "./VenomWhatsappListener";
import { getIO } from "../../libs/socket";
import wbotMonitor from "./WhatsappMonitor";
import { logger } from "../../utils/logger";

type StartWhatsAppSessionType = {
    whatsapp: Whatsapp;
    channelToEmitSocket: string;
    userParentId?: number;
}

export const VenomStartWhatsappSession = async ({
    whatsapp,
    channelToEmitSocket,
    userParentId
}: StartWhatsAppSessionType): Promise<void> => {
    await whatsapp.update({ status: "OPENING" });
    const io = getIO();
    io.to(channelToEmitSocket).emit("whatsappSession", {
        action: "update",
        session: whatsapp
    });

    try {
        const wbot = await initWbot({ whatsapp, channelToEmitSocket, userParentId });

        venomWhatsappListener(wbot, userParentId);
        wbotMonitor({ wbot, whatsapp, channelToEmitSocket, userParentId });
    } catch (err) {
        // @ts-ignore
        logger.error(err);
    }
};
