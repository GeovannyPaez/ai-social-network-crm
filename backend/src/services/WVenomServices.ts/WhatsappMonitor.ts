import * as Sentry from "@sentry/node";
import { Whatsapp as VenomWhatsapp } from 'venom-bot';

import { getIO } from "../../libs/socket";
import Whatsapp from "../../models/Whatsapp";
import { logger } from "../../utils/logger";
import { VenomStartWhatsappSession } from "./VenomStartWhatsappSession";

type WbotMonitorType = {
    wbot: VenomWhatsapp;
    whatsapp: Whatsapp;
    channelToEmitSocket: string;
    userParentId?: number;
}

const wbotMonitor = async ({
    wbot,
    whatsapp,
    channelToEmitSocket,
    userParentId
}: WbotMonitorType): Promise<void> => {
    const io = getIO();
    const sessionName = whatsapp.name;

    try {
        wbot.onStateChange(async (state) => {
            logger.info(`Monitor session: ${sessionName}, ${state}`);
            try {
                await whatsapp.update({ status: state });
            } catch (err) {
                Sentry.captureException(err);
                logger.error(err as any);
            }

            io.to(channelToEmitSocket).emit("whatsappSession", {
                action: "update",
                session: whatsapp
            });
        });

        // wbot.onBattery(async (batteryInfo) => {
        //   const { battery, plugged } = batteryInfo;
        //   logger.info(`Battery session: ${sessionName} ${battery}% - Charging? ${plugged}`);

        //   try {
        //     await whatsapp.update({ battery, plugged });
        //   } catch (err) {
        //     Sentry.captureException(err);
        //     logger.error(err);
        //   }

        //   io.to(channelToEmitSocket).emit("whatsappSession", {
        //     action: "update",
        //     session: whatsapp
        //   });
        // });

        wbot.onStreamChange(async (state) => {
            if (state === 'DISCONNECTED') {
                logger.info(`Disconnected session: ${sessionName}`);
                try {
                    await whatsapp.update({ status: "OPENING", session: "" });
                } catch (err) {
                    Sentry.captureException(err);
                    logger.error(err as any);
                }

                io.to(channelToEmitSocket).emit("whatsappSession", {
                    action: "update",
                    session: whatsapp
                });

                setTimeout(() => VenomStartWhatsappSession({ whatsapp, channelToEmitSocket, userParentId }), 2000);
            }
        });
    } catch (err) {
        Sentry.captureException(err);
        logger.error(err as any);
    }
};

export default wbotMonitor;
