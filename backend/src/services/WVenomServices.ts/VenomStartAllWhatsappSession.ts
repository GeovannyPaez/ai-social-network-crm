import buildParentChannelString from "../../helpers/BuildParentChannelString";
import ListWhatsAppsService from "../WhatsappService/ListWhatsAppsService";
import { VenomStartWhatsappSession } from "./VenomStartWhatsappSession";

export const StartAllWhatsAppsSessions = async (): Promise<void> => {
    const userWhatsapps = await ListWhatsAppsService();
    if (userWhatsapps.length > 0) {
        userWhatsapps.forEach(userWhatsapp => {
            const channelToEmitSocket = buildParentChannelString(userWhatsapp.userId);
            VenomStartWhatsappSession({ whatsapp: userWhatsapp.whatsapp, channelToEmitSocket, userParentId: userWhatsapp.userId });
        });
    }
};
