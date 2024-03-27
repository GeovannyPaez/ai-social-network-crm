import database from "../../database";

const truncate = async (): Promise<void> => {
  await database.truncate({ cascade: true, truncate: true, force: true });
};

const disconnect = async (): Promise<void> => {
  return database.connectionManager.close();
};

export { truncate, disconnect };
