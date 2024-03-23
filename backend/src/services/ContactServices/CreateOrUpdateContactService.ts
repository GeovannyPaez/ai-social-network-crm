import { build } from "factory-girl";
import { getIO } from "../../libs/socket";
import Contact from "../../models/Contact";
import buildParentChannelString from "../../helpers/BuildParentChannelString";

interface ExtraInfo {
  name: string;
  value: string;
}

interface Request {
  name: string;
  number: string;
  isGroup: boolean;
  email?: string;
  userParentId?: number | null;
  profilePicUrl?: string;
  extraInfo?: ExtraInfo[];
}

const CreateOrUpdateContactService = async ({
  name,
  number: rawNumber,
  profilePicUrl,
  isGroup,
  email = "",
  extraInfo = [],
  userParentId = null
}: Request): Promise<Contact> => {
  const number = isGroup ? rawNumber : rawNumber.replace(/[^0-9]/g, "");

  const io = getIO();
  const channelToEmitSocket = buildParentChannelString(userParentId || 0);
  let contact: Contact | null;

  contact = await Contact.findOne({ where: { number } });

  if (contact) {
    contact.update({ profilePicUrl });

    io.to(channelToEmitSocket).emit("contact", {
      action: "update",
      contact
    });
  } else {
    contact = await Contact.create({
      name,
      number,
      profilePicUrl,
      email,
      isGroup,
      extraInfo,
      userParentId
    });

    io.to(channelToEmitSocket).emit("contact", {
      action: "create",
      contact
    });
  }

  return contact;
};

export default CreateOrUpdateContactService;
