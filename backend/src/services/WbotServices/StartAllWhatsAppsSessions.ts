import buildParentChannelString from "../../helpers/BuildParentChannelString";
import ListWhatsAppsService from "../WhatsappService/ListWhatsAppsService";
import { StartWhatsAppSession } from "./StartWhatsAppSession";

export const StartAllWhatsAppsSessions = async (): Promise<void> => {
  const userWhatsapps = await ListWhatsAppsService();
  if (userWhatsapps.length > 0) {
    userWhatsapps.forEach(userWhatsapp => {
      const channelToEmitSocket = buildParentChannelString(userWhatsapp.userId);
      StartWhatsAppSession({ whatsapp: userWhatsapp.whatsapp, channelToEmitSocket, userParentId: userWhatsapp.userId });
    });
  }
};
