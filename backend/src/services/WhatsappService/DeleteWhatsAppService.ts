import Whatsapp from "../../models/Whatsapp";
import AppError from "../../errors/AppError";
import UserWhatsapp from "../../models/UserWhatsapp";

const DeleteWhatsAppService = async (id: string): Promise<void> => {
  const userWhatsapp = await UserWhatsapp.findOne({
    where: {
      whatsappId: id
    }
  })

  const whatsapp = await Whatsapp.findOne({
    where: { id }
  });

  if (!whatsapp || !userWhatsapp) {
    throw new AppError("ERR_NO_WAPP_FOUND", 404);
  }
  await userWhatsapp.destroy();
  await whatsapp.destroy();
};

export default DeleteWhatsAppService;
