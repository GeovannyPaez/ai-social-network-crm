// W
//   value
// }: Request): Promise<Setting | undefined> => {
//   const setting = await Setting.findOne({
//     where: { key }
//   });

//   if (!setting) {
//     throw new AppError("ERR_NO_SETTING_FOUND", 404);
//   }

//   await setting.update({ value });

//   return setting;
// };

// export default UpdateSettingService;
