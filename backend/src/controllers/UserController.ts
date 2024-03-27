import { Request, Response } from "express";
import { getIO } from "../libs/socket";

// import CheckSettingsHelper from "../helpers/CheckSettings";
import AppError from "../errors/AppError";

import CreateUserService from "../services/UserServices/CreateUserService";
import ListUsersService from "../services/UserServices/ListUsersService";
import UpdateUserService from "../services/UserServices/UpdateUserService";
import ShowUserService from "../services/UserServices/ShowUserService";
import DeleteUserService from "../services/UserServices/DeleteUserService";
import buildParentChannelString from "../helpers/BuildParentChannelString";

type IndexQuery = {
  searchParam: string;
  pageNumber: string;
};

export const index = async (req: Request, res: Response): Promise<Response> => {
  const { searchParam, pageNumber } = req.query as IndexQuery;
  const { parentId } = req.user;
  const { users, count, hasMore } = await ListUsersService({
    parentId,
    searchParam,
    pageNumber
  });

  return res.json({ users, count, hasMore });
};

export const store = async (req: Request, res: Response): Promise<Response> => {
  const { email, password, name, profile, queueIds, whatsappId } = req.body;
  // if (
  //   req.url === "/signup" &&
  //   (await CheckSettingsHelper("userCreation")) === "disabled"
  // ) {
  //   throw new AppError("ERR_USER_CREATION_DISABLED", 403);
  // } else if (req.url !== "/signup" && req.user.profile !== "admin") {
  //   throw new AppError("ERR_NO_PERMISSION", 403);
  // }
  if (req.url !== "/signup" && req.user.profile !== "admin") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }

  const user = await CreateUserService({
    email,
    password,
    name,
    profile,
    queueIds,
    whatsappId,
    parentId: Number(req.user?.id)
  });


  const channelParentId = buildParentChannelString(user.parentId || user.id);
  const io = getIO();
  io.to(channelParentId).emit("user", {
    action: "create",
    user
  });

  return res.status(200).json(user);
};

export const show = async (req: Request, res: Response): Promise<Response> => {
  const { userId } = req.params;

  const user = await ShowUserService(userId);

  return res.status(200).json(user);
};

export const update = async (
  req: Request,
  res: Response
): Promise<Response> => {
  if (req.user.profile !== "admin") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }

  const { userId } = req.params;
  const userData = req.body;
  const { parentId } = req.user;
  const user = await UpdateUserService({ userData, userId });

  const channelParentId = buildParentChannelString(parentId);

  const io = getIO();
  io.to(channelParentId).emit("user", {
    action: "update",
    user
  });

  return res.status(200).json(user);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userId } = req.params;
  const { parentId } = req.user;

  if (req.user.profile !== "admin") {
    throw new AppError("ERR_NO_PERMISSION", 403);
  }

  await DeleteUserService(userId);
  const channelParentId = buildParentChannelString(parentId);
  const io = getIO();
  io.to(channelParentId).emit("user", {
    action: "delete",
    userId
  });

  return res.status(200).json({ message: "User deleted" });
};
