import Queue from "../../models/Queue";
import UserWhatsapp from "../../models/UserWhatsapp";
import Whatsapp from "../../models/Whatsapp";


const ListWhatsAppsService = async (): Promise<UserWhatsapp[]> => {
  const userWhatsappSession = await UserWhatsapp.findAll({
    include: [
      {
        model: Whatsapp,
        as: "whatsapp",
        include: [
          {
            model: Queue,
            as: "queues",
            attributes: ["id", "name", "color", "greetingMessage"]
          }
        ]
      }
    ]
  });
  // const whatsapps = await Whatsapp.findAll({
  //   include: [
  //     {
  //       model: Queue,
  //       as: "queues",
  //       attributes: ["id", "name", "color", "greetingMessage"]
  //     }
  //   ]
  // });

  return userWhatsappSession;
};

export default ListWhatsAppsService;
