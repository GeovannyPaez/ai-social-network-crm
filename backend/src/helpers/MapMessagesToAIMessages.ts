import Message from "../models/Message";
import { MessageOpenAI } from "./TokenizerHelper";

function MapMessagesToAiMessages(messages: Message[]): MessageOpenAI[] {
    return messages.map(message => {
        return {
            content: message.body,
            role: !message.fromMe ? "user" : "assistant"
        }
    });
}

export default MapMessagesToAiMessages;