import QuickAnswer from "../../models/QuickAnswer";

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

  const quickAnswer = await QuickAnswer.create({ shortcut, message, userParentId: parentId });

  return quickAnswer;
};

export default CreateQuickAnswerService;
