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
  extraInfo?: ExtraInfo[];
}

const CreateContactService = async ({
  name,
  number,
  email = "",
  extraInfo = [],
  userParentId = null
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
      userParentId
    },
    {
      include: ["extraInfo"]
    }
  );

  return contact;
};

export default CreateContactService;
