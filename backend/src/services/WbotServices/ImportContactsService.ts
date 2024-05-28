import GetDefaultWhatsApp from "../../helpers/GetDefaultWhatsApp";
import { getWbot } from "../../libs/venom-bot";
import Contact from "../../models/Contact";
import { logger } from "../../utils/logger";
import { Contact as VContact } from "venom-bot";

const ImportContactsService = async (userId: number): Promise<void> => {
  const defaultWhatsapp = await GetDefaultWhatsApp(userId);

  const wbot = getWbot(defaultWhatsapp.id);

  let phoneContacts;

  try {
    phoneContacts = await wbot.getAllContacts() as VContact[];
  } catch (err) {
    logger.error(`Could not get whatsapp contacts from phone. Err: ${err}`);
  }

  if (phoneContacts) {
    await Promise.all(
      phoneContacts.map(async ({ id, name }) => {
        if (!id) {
          return null;
        }
        if (!name) {
          name = id.user;
        }

        const numberExists = await Contact.findOne({
          where: { number: id.user }
        });

        if (numberExists) return null;

        return await Contact.create({ number: id.user, name });
      })
    );
  }
};

export default ImportContactsService;
