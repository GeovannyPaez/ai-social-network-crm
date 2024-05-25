import { getWbot } from "../../libs/venom-bot";
import GetDefaultWhatsApp from "../../helpers/GetDefaultWhatsApp";
import Ticket from "../../models/Ticket";
import { Whatsapp } from "venom-bot";

const GetTicketVenomInstance = async (ticket: Ticket): Promise<Whatsapp> => {
    if (!ticket.whatsappId) {
        const defaultWhatsapp = await GetDefaultWhatsApp(ticket.user.id);

        await ticket.$set("whatsapp", defaultWhatsapp);
    }

    const wbot = getWbot(ticket.whatsappId);

    return wbot;
};

export default GetTicketVenomInstance;
