import { join } from "path";
import { promisify } from "util";
import { writeFile } from "fs";
import * as Sentry from "@sentry/node";


import Contact from "../../models/Contact";
import Ticket from "../../models/Ticket";
import Message from "../../models/Message";

import { getIO } from "../../libs/socket";
import CreateMessageService from "../MessageServices/CreateMessageService";
import { logger } from "../../utils/logger";
import CreateOrUpdateContactService from "../ContactServices/CreateOrUpdateContactService";
import FindOrCreateTicketService from "../TicketServices/FindOrCreateTicketService";
import ShowWhatsAppService from "../WhatsappService/ShowWhatsAppService";
import { debounce } from "../../helpers/Debounce";
import UpdateTicketService from "../TicketServices/UpdateTicketService";
// import CreateContactService from "../ContactServices/CreateContactService";
import formatBody from "../../helpers/Mustache";
import ShowAssistantService from "../AssistantService/ShowAssistantService";
import { handleAiMessage } from "../../helpers/HandleAiMessage";
import { Whatsapp as WhatsappClient, Message as VMessage, Contact as VContact, Ack } from "venom-bot";
import { getIdFromSessionName } from "../../libs/venom-bot";
import mime from "mime";

const writeFileAsync = promisify(writeFile);

const verifyContact = async (msgContact: VContact, userParentId: number | null): Promise<Contact> => {

    const profilePicUrl = msgContact.profilePicThumbObj.eurl;

    const contactData = {
        name: msgContact.name || msgContact.pushname || msgContact.id.user,
        number: msgContact.id.user,
        profilePicUrl,
        isGroup: false, // falta implementar si es grupo
        userParentId
    };

    const contact = await CreateOrUpdateContactService(contactData);

    return contact;
};

const verifyQuotedMessage = async (
    msg: VMessage
): Promise<Message | null> => {
    if (!msg.quotedMsgObj) return null;
    // @ts-ignore
    const wbotQuotedMsg = msg.quotedMsgObj.id;

    const quotedMsg = await Message.findOne({
        where: { id: wbotQuotedMsg }
    });

    if (!quotedMsg) return null;

    return quotedMsg;
};

// generate random id string for file names, function got from: https://stackoverflow.com/a/1349426/1851801
function makeRandomId(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}


const verifyMediaMessage = async (
    msg: VMessage,
    ticket: Ticket,
    contact: Contact,
    session: WhatsappClient
): Promise<Message> => {
    const quotedMsg = await verifyQuotedMessage(msg);

    const buffer = await session.decryptFile(msg);
    const media = {
        data: buffer.toString('base64'), // Convertimos el buffer a base64 para guardar
        mimetype: msg.mimetype,
        filename: msg.filename,
    };

    if (!media) {
        throw new Error("ERR_WAPP_DOWNLOAD_MEDIA");
    }

    let randomId = makeRandomId(5);

    if (!media.filename) {
        const ext = mime.extension(media.mimetype);
        media.filename = `${randomId}-${new Date().getTime()}.${ext}`;
    } else {
        media.filename = media.filename.split('.').slice(0, -1).join('.') + '.' + randomId + '.' + media.filename.split('.').slice(-1);
    }

    try {
        await writeFileAsync(
            join(__dirname, "..", "..", "..", "public", media.filename),
            media.data,
            "base64"
        );
    } catch (err) {
        Sentry.captureException(err);
        if (err instanceof Object)
            logger.error(err);
    }

    const messageData = {
        id: msg.id,
        ticketId: ticket.id,
        contactId: msg.fromMe ? undefined : contact.id,
        body: msg.body || media.filename,
        fromMe: msg.fromMe,
        read: msg.fromMe,
        mediaUrl: media.filename,
        mediaType: media.mimetype.split("/")[0],
        quotedMsgId: quotedMsg?.id
    };

    await ticket.update({ lastMessage: msg.body || media.filename });
    const newMessage = await CreateMessageService({ messageData });

    return newMessage;
};
const verifyMessage = async (
    msg: VMessage,
    ticket: Ticket,
    contact: Contact
) => {

    // if (msg.type === 'location')
    //     return;
    // msg = prepareLocation(msg);

    const quotedMsg = await verifyQuotedMessage(msg);
    const messageData = {
        id: msg.id,
        ticketId: ticket.id,
        contactId: msg.fromMe ? undefined : contact.id,
        body: msg.body,
        fromMe: msg.fromMe,
        mediaType: msg.type,
        read: msg.fromMe,
        quotedMsgId: quotedMsg?.id
    };

    // @ts-ignore
    await ticket.update({ lastMessage: msg.type === "location" ? msg.location.description ? "Localization - " + msg.location?.description.split('\\n')[0] : "Localization" : msg.body });

    await CreateMessageService({ messageData });
};

// const prepareLocation = (msg: VMessage): VMessage => {
//     let gmapsUrl = "https://maps.google.com/maps?q=" + msg..latitude + "%2C" + msg.location.longitude + "&z=17&hl=pt-BR";

//     msg.body = "data:image/png;base64," + msg.body + "|" + gmapsUrl;
//     // @ts-ignore
//     msg.body += "|" + (msg.location.description ? msg.location.description : (msg.location.latitude + ", " + msg.location.longitude))
//     return msg;
// };

const verifyQueue = async (
    wbot: WhatsappClient,
    msg: VMessage,
    ticket: Ticket,
    contact: Contact
) => {
    const { queues, greetingMessage } = await ShowWhatsAppService(getIdFromSessionName(wbot.session!));

    if (queues.length === 1) {
        await UpdateTicketService({
            ticketData: { queueId: queues[0].id },
            ticketId: ticket.id
        });

        return;
    }

    const selectedOption = msg.body;

    const choosenQueue = queues[+selectedOption - 1];

    if (choosenQueue) {
        await UpdateTicketService({
            ticketData: { queueId: choosenQueue.id },
            ticketId: ticket.id
        });

        const body = formatBody(`\u200e${choosenQueue.greetingMessage}`, contact);

        const sentMessage = await wbot.sendText(`${contact.number}@c.us`, body);

        await verifyMessage(sentMessage as VMessage, ticket, contact);
    } else {
        let options = "";

        queues.forEach((queue, index) => {
            options += `*${index + 1}* - ${queue.name}\n`;
        });

        const body = formatBody(`\u200e${greetingMessage}\n${options}`, contact);

        const debouncedSentMessage = debounce(
            async () => {
                const sentMessage = await wbot.sendText(
                    `${contact.number}@c.us`,
                    body
                );
                verifyMessage(sentMessage as VMessage, ticket, contact);
            },
            3000,
            ticket.id
        );

        debouncedSentMessage();
    }
};

const isValidMsg = (msg: VMessage): boolean => {
    if (msg.from === "status@broadcast") return false;
    if (
        msg.type === "chat" ||
        msg.type === "audio" ||
        msg.type === "ptt" ||
        msg.type === "video" ||
        msg.type === "image" ||
        msg.type === "document" ||
        msg.type === "vcard" ||
        //msg.type === "multi_vcard" ||
        msg.type === "sticker" ||
        msg.type === "location"
    )
        return true;
    return false;
};

const handleMessage = async (
    msg: VMessage,
    session: WhatsappClient,
    userParentId: number | null
): Promise<void> => {
    if (!isValidMsg(msg)) {
        return;
    }
    try {
        let msgContact: VContact;
        let groupContact: Contact | undefined;
        if (msg.fromMe) {
            msgContact = await session.getContact(msg.to);
        } else {
            msgContact = await session.getContact(msg.from);
        }

        const chat = msg.chat;

        if (chat.isGroup) {
            let msgGroupContact;

            if (msg.fromMe) {
                msgGroupContact = await session.getContact(msg.to);
            } else {
                msgGroupContact = await session.getContact(msg.from);
            }

            groupContact = await verifyContact(msgGroupContact, userParentId);
        }

        const whatsapp = await ShowWhatsAppService(getIdFromSessionName(session.session!));
        const unreadMessages = msg.fromMe ? 0 : chat.unreadCount;

        const contact = await verifyContact(msgContact, userParentId);
        if (
            unreadMessages === 0 &&
            whatsapp.farewellMessage &&
            formatBody(whatsapp.farewellMessage, contact) === msg.body
        ) return;

        const ticket = await FindOrCreateTicketService(
            contact,
            getIdFromSessionName(session.session!),
            unreadMessages,
            groupContact
        );
        if (msg.type != "chat" && msg.type != "vcard" && msg.type != "location" && msg.type != "multi_vcard") {
            await verifyMediaMessage(msg, ticket, contact, session);
        } else {
            await verifyMessage(msg, ticket, contact);
        }
        if (
            !ticket.queue &&
            !chat.isGroup &&
            !msg.fromMe &&
            !ticket.userId &&
            whatsapp.queues.length >= 1
        ) {
            await verifyQueue(session, msg, ticket, contact);
        }
        if (!msg.fromMe && msg.type === "chat" && userParentId) {
            const assistant = await ShowAssistantService(userParentId);

            if (!assistant || !assistant?.isActivated) return;

            if (!contact.isAssistantActive && !assistant.isActivatedForAllTickets) return

            await handleAiMessage({
                ticket,
                assistant
            })
        }
        /* if (msg.type === "multi_vcard") {
          try {
            const array = msg.vCards.toString().split("\n");
            let name = "";
            let number = "";
            const obj = [];
            const conts = [];
            for (let index = 0; index < array.length; index++) {
              const v = array[index];
              const values = v.split(":");
              for (let ind = 0; ind < values.length; ind++) {
                if (values[ind].indexOf("+") !== -1) {
                  number = values[ind];
                }
                if (values[ind].indexOf("FN") !== -1) {
                  name = values[ind + 1];
                }
                if (name !== "" && number !== "") {
                  obj.push({
                    name,
                    number
                  });
                  name = "";
                  number = "";
                }
              }
            }
    
            // eslint-disable-next-line no-restricted-syntax
            for await (const ob of obj) {
              try {
                const cont = await CreateContactService({
                  name: ob.name,
                  number: ob.number.replace(/\D/g, "")
                });
                conts.push({
                  id: cont.id,
                  name: cont.name,
                  number: cont.number
                });
              } catch (error) {
                if (error.message === "ERR_DUPLICATED_CONTACT") {
                  const cont = await GetContactService({
                    name: ob.name,
                    number: ob.number.replace(/\D/g, ""),
                    email: ""
                  });
                  conts.push({
                    id: cont.id,
                    name: cont.name,
                    number: cont.number
                  });
                }
              }
            }
            msg.body = JSON.stringify(conts);
          } catch (error) {
            console.log(error);
          }
        } */
    } catch (err) {
        Sentry.captureException(err);
        logger.error(`Error handling whatsapp message: Err: ${err}`);
    }
};

const handleMsgAck = async (msg: Ack) => {

    await new Promise(r => setTimeout(r, 500));

    const io = getIO();

    try {
        const messageToUpdate = await Message.findByPk(msg.id.id, {
            include: [
                "contact",
                {
                    model: Message,
                    as: "quotedMsg",
                    include: ["contact"]
                }
            ]
        });
        if (!messageToUpdate) {
            return;
        }
        await messageToUpdate.update({ ack: msg.ack });

        io.to(messageToUpdate.ticketId.toString()).emit("appMessage", {
            action: "update",
            message: messageToUpdate
        });
    } catch (err) {
        Sentry.captureException(err);
        logger.error(`Error handling message ack. Err: ${err}`);
    }
};



const venomWhatsappListener = (wbot: WhatsappClient, userParentId: number | null = null): void => {
    // wbot.onAnyMessage(async msg => {
    //     logger.info("Any message");
    //     logger.info(msg.body);
    //     handleMessage(msg, wbot, userParentId);
    // });

    wbot.onMessage(async msg => {
        handleMessage(msg, wbot, userParentId);
    });

    wbot.onAck(async (ack) => {
        handleMsgAck(ack);
    });

};

export { venomWhatsappListener, handleMessage };
