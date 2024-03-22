import AppError from "../../errors/AppError";
import QuickAnswer from "../../models/QuickAnswer";
import { Op } from "sequelize";
interface Request {
  shortcut: string;
  message: string;
  parentId?: number;
}

const CreateQuickAnswerService = async ({
  shortcut,
  message,
  parentId = undefined
}: Request): Promise<QuickAnswer> => {
  const isQuickAnswerAlreadyExists = await QuickAnswer.findOne({
    where: {
      [Op.and]: [{ shortcut }, { userParentId: parentId || null }]
    }
  });
  if (isQuickAnswerAlreadyExists) {
    throw new AppError("ERR__SHORTCUT_DUPLICATED");
  }
  const quickAnswer = await QuickAnswer.create({ shortcut, message, userParentId: parentId });

  return quickAnswer;
};

export default CreateQuickAnswerService;
