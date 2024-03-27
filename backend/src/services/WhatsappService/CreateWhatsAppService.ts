import * as Yup from "yup";

import AppError from "../../errors/AppError";
import Whatsapp from "../../models/Whatsapp";
import UserWhatsapp from "../../models/UserWhatsapp";
import AssociateWhatsappQueue from "./AssociateWhatsappQueue";
import User from "../../models/User";

interface Request {
  name: string;
  queueIds?: number[];
  greetingMessage?: string;
  farewellMessage?: string;
  status?: string;
  isDefault?: boolean;
  userId: number;
}

interface Response {
  whatsapp: Whatsapp;
  oldDefaultWhatsapp: Whatsapp | null;
}

const CreateWhatsAppService = async ({
  name,
  status = "OPENING",
  queueIds = [],
  greetingMessage,
  farewellMessage,
  isDefault = false,
  userId,
}: Request): Promise<Response> => {
  const schema = Yup.object().shape({
    name: Yup.string()
      .required()
      .min(2)
      .test(
        "Check-name",
        "This whatsapp name is already used.",
        async value => {
          if (!value) return false;
          const nameExists = await Whatsapp.findOne({
            where: { name: value }
          });
          return !nameExists;
        }
      ),
    isDefault: Yup.boolean().required()
  });

  try {
    await schema.validate({ name, status, isDefault });
  } catch (err) {
    // @ts-ignore
    throw new AppError(err.message);
  }

  const whatsappFound = await UserWhatsapp.findOne({
    where: {
      userId
    }
  })

  isDefault = !whatsappFound;

  let oldDefaultWhatsapp: Whatsapp | null = null;

  if (isDefault) {
    oldDefaultWhatsapp = await UserWhatsapp.findOne({
      where: { userId },
      include: [
        {
          model: Whatsapp,
          as: "whatsapp",
          where: { isDefault: true }
        }
      ]
    }).then(userWhatsapp => userWhatsapp?.whatsapp || null);
    if (oldDefaultWhatsapp) {
      await oldDefaultWhatsapp.update({ isDefault: false });
    }
  }

  if (queueIds.length > 1 && !greetingMessage) {
    throw new AppError("ERR_WAPP_GREETING_REQUIRED");
  }
  const user = await User.findOne({
    where: {
      id: userId
    },
  });
  if (!user) {
    throw new AppError("ERR_USER_NOT_FOUND");
  }
  const parentUserId = user.parentId ? user.parentId : user.id;

  const whatsapp = await Whatsapp.create(
    {
      name,
      status,
      greetingMessage,
      farewellMessage,
      isDefault
    },
    { include: ["queues"] }
  );
  await UserWhatsapp.create({
    userId: parentUserId,
    whatsappId: whatsapp.id,
  })

  await AssociateWhatsappQueue(whatsapp, queueIds);

  return { whatsapp, oldDefaultWhatsapp };
};

export default CreateWhatsAppService;
