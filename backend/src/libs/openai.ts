
import OpenAI from "openai";

export const getOpenAI = (Api_key: string) => {
    return new OpenAI({
        apiKey: Api_key,
        fetch: fetch
    });
}