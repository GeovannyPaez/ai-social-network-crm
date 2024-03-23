import { Request, Response } from "express";
import { getIO } from "../libs/socket";
import { removeWbot } from "../libs/wbot";
import { StartWhatsAppSession } from "../services/WbotServices/StartWhatsAppSession";

import CreateWhatsAppService from "../services/WhatsappService/CreateWhatsAppService";
import DeleteWhatsAppService from "../services/WhatsappService/DeleteWhatsAppService";
import ShowWhatsAppService from "../services/WhatsappService/ShowWhatsAppService";
import UpdateWhatsAppService from "../services/WhatsappService/UpdateWhatsAppService";
import ListByUserParentWhatsappService from "../services/WhatsappService/ListByUserParentWhatsappService";
import buildParentChannelString from "../helpers/BuildParentChannelString";

interface WhatsappData {
  name: string;
  queueIds: number[];
  greetingMessage?: string;
  farewellMessage?: string;
  status?: string;
  isDefault?: boolean;
}

export const index = async (req: Request, res: Response): Promise<Response> => {
  const userId = Number(req.user.id); // This line is missing in the original code
  const whatsapps = await ListByUserParentWhatsappService(userId);

  return res.status(200).json(whatsapps);
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const {
    name,
    status,
    isDefault,
    greetingMessage,
    farewellMessage,
    queueIds
  }: WhatsappData = req.body;
  const userId = Number(req.user.id); // This line is missing in the original code
  const { whatsapp, oldDefaultWhatsapp } = await CreateWhatsAppService({
    name,
    status,
    isDefault,
    greetingMessage,
    farewellMessage,
    queueIds,
    userId
  });
  const parentIdChannel = buildParentChannelString(req.user.parentId);
  StartWhatsAppSession({ whatsapp, channelToEmitSocket: parentIdChannel, userParentId: req.user.parentId });

  const io = getIO();
  io.to(parentIdChannel).emit("whatsapp", {
    action: "update",
    whatsapp
  });

  if (oldDefaultWhatsapp) {
    io.to(parentIdChannel).emit("whatsapp", {
      action: "update",
      whatsapp: oldDefaultWhatsapp
    });
  }

  return res.status(200).json(whatsapp);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { whatsappId } = req.params;

  const whatsapp = await ShowWhatsAppService(whatsappId);

  return res.status(200).json(whatsapp);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { whatsappId } = req.params;
  const whatsappData = req.body;
  const parentId = req.user.parentId;

  const { whatsapp, oldDefaultWhatsapp } = await UpdateWhatsAppService({
    whatsappData,
    whatsappId
  });

  const io = getIO();
  io.to(buildParentChannelString(parentId)).emit("whatsapp", {
    action: "update",
    whatsapp
  });


  if (oldDefaultWhatsapp) {
    io.to(buildParentChannelString(parentId)).emit("whatsapp", {
      action: "update",
      whatsapp: oldDefaultWhatsapp
    });

  }

  return res.status(200).json(whatsapp);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { whatsappId } = req.params;

  await DeleteWhatsAppService(whatsappId);
  removeWbot(+whatsappId);

  const io = getIO();
  io.emit("whatsapp", {
    action: "delete",
    whatsappId: +whatsappId
  });

  return res.status(200).json({ message: "Whatsapp deleted." });
};
