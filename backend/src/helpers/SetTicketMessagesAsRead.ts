import { getIO } from "../libs/socket";
import Message from "../models/Message";
import Ticket from "../models/Ticket";
import GetTicketVenomInstance from "../services/WVenomServices.ts/GetTicketVenomInstance";
import { logger } from "../utils/logger";

const SetTicketMessagesAsRead = async (ticket: Ticket): Promise<void> => {
  await Message.update(
    { read: true },
    {
      where: {
        ticketId: ticket.id,
        read: false
      }
    }
  );

  await ticket.update({ unreadMessages: 0 });

  try {
    const wbot = await GetTicketVenomInstance(ticket);
    await wbot.markMarkSeenMessage(
      `${ticket.contact.number}@${ticket.isGroup ? "g" : "c"}.us`
    );
  } catch (err) {
    logger.warn(
      `Could not mark messages as read. Maybe whatsapp session disconnected? Err: ${err}`
    );
  }

  const io = getIO();
  io.to(ticket.status).to("notification").emit("ticket", {
    action: "updateUnread",
    ticketId: ticket.id
  });
};

export default SetTicketMessagesAsRead;
