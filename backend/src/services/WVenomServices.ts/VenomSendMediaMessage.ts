import AppError from '../../errors/AppError';
import GetTicketVenomInstance from './GetTicketVenomInstance';
import Ticket from '../../models/Ticket';
import formatBody from '../../helpers/Mustache';
import CreateMessageService from '../MessageServices/CreateMessageService';

interface Request {
    media: Express.Multer.File;
    ticket: Ticket;
    body?: string;
}

const VenomSendMediaMessage = async ({
    media,
    ticket,
    body
}: Request): Promise<void> => {
    try {
        const wbot = await GetTicketVenomInstance(ticket);
        const hasBody = body
            ? formatBody(body as string, ticket.contact)
            : "Documento adjunto";

        let mediaOptions = {
            caption: hasBody,
            isImage: media.mimetype.startsWith("image/"),
            isVideo: media.mimetype.startsWith("video/"),
            isDocument: !media.mimetype.startsWith("image/") && !media.mimetype.startsWith("video/") && !media.mimetype.startsWith("audio/"),
            isAudio: media.mimetype.startsWith("audio/"),
            quotedMessageId: undefined // Puedes agregar aquí si tienes mensajes citados
        };
        if (mediaOptions.isImage) {
            await wbot.sendImage(
                `${ticket.contact.number}@${ticket.isGroup ? "g" : "c"}.us`,
                media.path,
                media.filename,
                hasBody
            );
        } else if (mediaOptions.isVideo) {
            await wbot.sendPhotoVideoViaTyping(
                `${ticket.contact.number}@${ticket.isGroup ? "g" : "c"}.us`,
                media.path,
                media.filename,
            );
        } else if (mediaOptions.isDocument) {
            await wbot.sendFile(
                `${ticket.contact.number}@${ticket.isGroup ? "g" : "c"}.us`,
                media.path,
                media.filename,
                "Documento adjunto"
            );

        } else if (mediaOptions.isAudio) {
            await wbot.sendVoice(
                `${ticket.contact.number}@${ticket.isGroup ? "g" : "c"}.us`,
                media.path,
            );
        }
        await CreateMessageService({
            messageData: {
                id: media.filename,
                ticketId: ticket.id,
                body: body || media.filename,
                fromMe: true,
                read: true,
                mediaType: media.mimetype.startsWith("image/") ? "image" : media.mimetype.startsWith("video/") ? "video" : media.mimetype.startsWith("audio/") ? "audio" : "document",
                mediaUrl: media.filename
            }
        });
        await ticket.update({ lastMessage: body || media.filename });

        // fs.unlinkSync(media.path);

    } catch (err) {
        throw new AppError("ERR_SENDING_WAPP_MSG");
    }
};

export default VenomSendMediaMessage;
