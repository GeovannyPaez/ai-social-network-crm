import Queue from "../../models/Queue";

const ListQueuesService = async (parentId: number | null = null): Promise<Queue[]> => {
  const queues = await Queue.findAll({
    where: { userParentId: parentId },
    order: [["createdAt", "DESC"]]
  });

  return queues;
};

export default ListQueuesService;
