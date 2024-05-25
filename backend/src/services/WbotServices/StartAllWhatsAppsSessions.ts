import buildParentChannelString from "../../helpers/BuildParentChannelString";
import { VenomStartWhatsappSession } from "../WVenomServices.ts/VenomStartWhatsappSession";
import ListWhatsAppsService from "../WhatsappService/ListWhatsAppsService";

export const StartAllWhatsAppsSessions = async (): Promise<void> => {
  const userWhatsapps = await ListWhatsAppsService();
  if (userWhatsapps.length > 0) {
    userWhatsapps.forEach(userWhatsapp => {
      const channelToEmitSocket = buildParentChannelString(userWhatsapp.userId);
      VenomStartWhatsappSession({ whatsapp: userWhatsapp.whatsapp, channelToEmitSocket, userParentId: userWhatsapp.userId });
    });
  }
};
