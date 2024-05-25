import { Request, Response } from "express";
import { getWbot } from "../libs/wbot";
import ShowWhatsAppService from "../services/WhatsappService/ShowWhatsAppService";
import UpdateWhatsAppService from "../services/WhatsappService/UpdateWhatsAppService";
import buildParentChannelString from "../helpers/BuildParentChannelString";
import { VenomStartWhatsappSession } from "../services/WVenomServices.ts/VenomStartWhatsappSession";

const store = async (req: Request, res: Response): Promise<Response> => {
  const { whatsappId } = req.params;
  const whatsapp = await ShowWhatsAppService(whatsappId);
  const channelToEmitSocket = buildParentChannelString(req.user.parentId);
  VenomStartWhatsappSession({ whatsapp, channelToEmitSocket, userParentId: req.user.parentId });

  return res.status(200).json({ message: "Starting session." });
};

const update = async (req: Request, res: Response): Promise<Response> => {
  const { whatsappId } = req.params;
  const channelToEmitSocket = buildParentChannelString(req.user.parentId);
  const { whatsapp } = await UpdateWhatsAppService({
    whatsappId,
    whatsappData: { session: "" }
  });

  VenomStartWhatsappSession({ whatsapp, channelToEmitSocket, userParentId: req.user.parentId });

  return res.status(200).json({ message: "Starting session." });
};

const remove = async (req: Request, res: Response): Promise<Response> => {
  const { whatsappId } = req.params;
  const whatsapp = await ShowWhatsAppService(whatsappId);

  const wbot = getWbot(whatsapp.id);

  wbot.logout();

  return res.status(200).json({ message: "Session disconnected." });
};

export default { store, remove, update };
