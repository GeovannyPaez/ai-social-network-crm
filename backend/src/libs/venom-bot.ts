import { create, Whatsapp as VenomWhatsapp } from 'venom-bot';
import { getIO } from "./socket";
import Whatsapp from "../models/Whatsapp";
import AppError from "../errors/AppError";
import { logger } from "../utils/logger";
import { handleMessage } from '../services/WVenomServices.ts/VenomWhatsappListener';

type InitWbotType = {
    whatsapp: Whatsapp;
    channelToEmitSocket: string;
    userParentId?: number;
}
const sessions: VenomWhatsapp[] = [];

const syncUnreadMessages = async (wbot: VenomWhatsapp, userParentId: number | null = null) => {

    const unreadMessages = await wbot.getUnreadMessages();
    if (unreadMessages.length > 0) {
        for (const msg of unreadMessages) {
            await handleMessage(msg, wbot, userParentId);
        }
    }
};

export const initWbot = async ({
    whatsapp,
    channelToEmitSocket,
    userParentId
}: InitWbotType): Promise<VenomWhatsapp> => {
    return new Promise((resolve, reject) => {
        try {
            const io = getIO();
            const sessionName = whatsapp.name;

            create(
                buildSessionName(whatsapp.id),
                (base64Qrimg, asciiQR, attempts, urlCode) => {
                    logger.info("Session:", sessionName);
                    whatsapp.update({ qrcode: urlCode, status: "qrcode", retries: 0 });

                    io.to(channelToEmitSocket).emit("whatsappSession", {
                        action: "update",
                        session: whatsapp
                    });
                },
                (statusSession) => {
                    logger.info(`Session: ${sessionName} ${statusSession}`);
                },
                {
                    logQR: false,
                }

            ).then((wbot) => {
                wbot.onStateChange((state) => {
                    if (state === 'CONFLICT' || state === 'UNLAUNCHED') wbot.useHere();
                });

                // wbot.onMessage(async (message) => {
                //     await handleMessage(message, wbot, userParentId);
                // });

                sessions.push(wbot);
                whatsapp.update({
                    status: "CONNECTED",
                    qrcode: "",
                    retries: 0
                });

                io.to(channelToEmitSocket).emit("whatsappSession", {
                    action: "update",
                    session: whatsapp
                });

                syncUnreadMessages(wbot, userParentId);
                resolve(wbot);
            }).catch((err) => {
                logger.error(`Session: ${sessionName} AUTHENTICATION FAILURE! Reason: ${err.message}`);

                whatsapp.update({ session: "", retries: 0 });

                io.to(channelToEmitSocket).emit("whatsappSession", {
                    action: "update",
                    session: whatsapp
                });

                reject(new Error("Error starting whatsapp session."));
            });

        } catch (err) {
            logger.error(err as any);
        }
    });
};

export const getWbot = (whatsappId: number): VenomWhatsapp => {
    const session = sessions.find(s => s.session === buildSessionName(whatsappId));

    if (!session) {
        throw new AppError("ERR_WAPP_NOT_INITIALIZED");
    }
    return session;
};

export const removeWbot = (whatsappId: number): void => {
    try {
        const sessionIndex = sessions.findIndex(s => s.session === buildSessionName(whatsappId));
        if (sessionIndex !== -1) {
            sessions[sessionIndex].close();
            sessions.splice(sessionIndex, 1);
        }
    } catch (err) {
        logger.error(err as any);
    }
};

export const buildSessionName = (whatsappId: number): string => {
    return `sessionName_${whatsappId}`;
}

export const getIdFromSessionName = (sessionName: string): number => {
    return parseInt(sessionName.replace("sessionName_", ""));
}