import AppError from "../../errors/AppError";
import Contact from "../../models/Contact";

interface ExtraInfo {
  name: string;
  value: string;
}

interface Request {
  name: string;
  number: string;
  email?: string;
  userParentId?: number | null;
  profilePicUrl?: string;
  isAssistantActive?: boolean;
  extraInfo?: ExtraInfo[];
}

const CreateContactService = async ({
  name,
  number,
  email = "",
  extraInfo = [],
  userParentId = null,
  isAssistantActive = false
}: Request): Promise<Contact> => {
  const numberExists = await Contact.findOne({
    where: { number, userParentId }
  });

  if (numberExists) {
    throw new AppError("ERR_DUPLICATED_CONTACT");
  }

  const contact = await Contact.create(
    {
      name,
      number,
      email,
      extraInfo,
      userParentId,
      isAssistantActive
    },
    {
      include: ["extraInfo"]
    }
  );

  return contact;
};

export default CreateContactService;
