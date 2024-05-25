import AppError from "../../errors/AppError";
// import SerializeWbotMsgId from "../../helpers/SerializeWbotMsgId";
import Message from "../../models/Message";
import Ticket from "../../models/Ticket";

import formatBody from "../../helpers/Mustache";
import GetTicketVenomInstance from "./GetTicketVenomInstance";
import { Message as VenomMessage } from "venom-bot";
import { logger } from "../../utils/logger";
import CreateMessageService from "../MessageServices/CreateMessageService";
interface Request {
    body: string;
    ticket: Ticket;
    quotedMsg?: Message;
}

const VenomSendWhatsappMessage = async ({
    body,
    ticket,
    quotedMsg
}: Request): Promise<VenomMessage> => {
    let quotedMsgSerializedId: string | undefined;
    if (quotedMsg) {
        logger.info(`Quoted message found: ${quotedMsg.id}`);
        // await GetWbotMessage(ticket, quotedMsg.id);
        // quotedMsgSerializedId = SerializeWbotMsgId(ticket, quotedMsg);
    }

    const wbot = await GetTicketVenomInstance(ticket);

    try {
        const sentMessage = await wbot.sendMessageOptions(
            `${ticket.contact.number}@${ticket.isGroup ? "g" : "c"}.us`,
            formatBody(body, ticket.contact),
            {
                quotedMessageId: quotedMsgSerializedId,
                linkPreview: false
            }
        );
        await CreateMessageService({
            messageData: {
                id: sentMessage.id,
                ticketId: ticket.id,
                body: body,
                fromMe: true,
                read: true,
                mediaType: "text"
            }
        });

        await ticket.update({ lastMessage: body });
        return sentMessage;
    } catch (err) {
        throw new AppError("ERR_SENDING_WAPP_MSG");
    }
};

export default VenomSendWhatsappMessage;
