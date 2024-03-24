import AppError from "../../errors/AppError";
import Contact from "../../models/Contact";
import CreateContactService from "./CreateContactService";

interface ExtraInfo {
    name: string;
    value: string;
}

interface Request {
    name: string;
    userParentId?: number | null;
    number: string;
    email?: string;
    profilePicUrl?: string;
    extraInfo?: ExtraInfo[];
}

const GetContactService = async ({ name, number, userParentId }: Request): Promise<Contact> => {
    const numberExists = await Contact.findOne({
        where: { number, userParentId: userParentId || null }
    });

    if (!numberExists) {
        const contact = await CreateContactService({
            name,
            number,
            userParentId
        })

        if (contact == null)
            throw new AppError("CONTACT_NOT_FIND")
        else
            return contact
    }

    return numberExists
};

export default GetContactService;