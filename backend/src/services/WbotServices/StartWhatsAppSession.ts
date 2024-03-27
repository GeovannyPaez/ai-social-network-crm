import { initWbot } from "../../libs/wbot";
import Whatsapp from "../../models/Whatsapp";
import { wbotMessageListener } from "./wbotMessageListener";
import { getIO } from "../../libs/socket";
import wbotMonitor from "./wbotMonitor";
import { logger } from "../../utils/logger";

type StartWhatsAppSessionType = {
  whatsapp: Whatsapp;
  channelToEmitSocket: string;
  userParentId?: number;
}

export const StartWhatsAppSession = async ({
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
    wbotMessageListener(wbot, userParentId);
    wbotMonitor({ wbot, whatsapp, channelToEmitSocket, userParentId });
  } catch (err) {
    // @ts-ignore
    logger.error(err);
  }
};
