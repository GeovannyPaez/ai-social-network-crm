import { encoding_for_model } from "tiktoken"
const gpt3 = encoding_for_model("gpt-3.5-turbo-0125")

export const countTokens = (text) => {
    return gpt3.encode(text).length
}