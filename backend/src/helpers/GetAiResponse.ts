import { AiResponse, AiResponseCreator } from "./AiResponse";

export default async function (aiResponseCrator: AiResponseCreator): Promise<AiResponse> {
    return await aiResponseCrator.getResponse();
}