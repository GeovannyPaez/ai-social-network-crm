import AppError from "../../errors/AppError";
import Contact from "../../models/Contact";
import ContactCustomField from "../../models/ContactCustomField";

interface ExtraInfo {
  id?: number;
  name: string;
  value: string;
}
interface ContactData {
  email?: string;
  number?: string;
  isAssistantActive?: boolean;
  name?: string;
  extraInfo?: ExtraInfo[];
}

interface Request {
  contactData: ContactData;
  contactId: string;
  userParentId: number | null;
}

const UpdateContactService = async ({
  contactData,
  contactId,
  userParentId
}: Request): Promise<Contact> => {
  const { email, name, number, extraInfo, isAssistantActive } = contactData;

  const contact = await Contact.findOne({
    where: { id: contactId, userParentId },
    attributes: ["id", "name", "number", "email", "profilePicUrl", "userParentId"],
    include: ["extraInfo"]
  });

  if (!contact) {
    throw new AppError("ERR_NO_CONTACT_FOUND", 404);
  }

  if (extraInfo) {
    await Promise.all(
      extraInfo.map(async info => {
        await ContactCustomField.upsert({ ...info, contactId: contact.id });
      })
    );

    await Promise.all(
      contact.extraInfo.map(async oldInfo => {
        const stillExists = extraInfo.findIndex(info => info.id === oldInfo.id);

        if (stillExists === -1) {
          await ContactCustomField.destroy({ where: { id: oldInfo.id } });
        }
      })
    );
  }

  await contact.update({
    name,
    number,
    email,
    isAssistantActive
  });

  await contact.reload({
    attributes: ["id", "name", "number", "email", "profilePicUrl", "userParentId"],
    include: ["extraInfo"]
  });

  return contact;
};

export default UpdateContactService;
