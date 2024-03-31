import Assistant from "../models/Assistant"
import Message from "../models/Message"
import Ticket from "../models/Ticket"
import ShowTicketService from "../services/TicketServices/ShowTicketService"
import SendWhatsAppMessage from "../services/WbotServices/SendWhatsAppMessage"
import { logger } from "../utils/logger"
import GetAiResponse from "./GetAiResponse"
import { ResponseOpenAiChatCompletions } from "./ResponseOpenaiChatCompletions"
import ShowAiModelService from "../services/AiModelServices/ShowAiModelService"
import { CountMessageTokens, CountMessagesTokens, MessageOpenAI } from "./TokenizerHelper"
import CryptoHelper from "./CryptoHelper"
// import SendWhatsAppMessage from "../services/WbotServices/SendWhatsAppMessage"

type handleAiMessageType = {
    ticket: Ticket
    assistant: Assistant
}

export const handleAiMessage = async ({
    ticket,
    assistant,
}: handleAiMessageType): Promise<void> => {
    try {
        const ticketWitIncludes = await ShowTicketService(ticket.id)
        const messages = await Message.findAll({
            where: {
                ticketId: ticket.id
            },
            order: [["createdAt", "ASC"]]
        })
        const lastTenMessages = messages.slice(-10)
        const openiaMessages: MessageOpenAI[] = lastTenMessages.map(msg => {
            return {
                role: msg.fromMe ? "assistant" : "user",
                content: msg.body
            }
        })

        const model = assistant.model;

        if (!model) return;
        const tokesnToRequest = CountMessagesTokens(openiaMessages);
        const tokensInstruction = CountMessageTokens(assistant.instructions)
        const totalTokens = tokesnToRequest + tokensInstruction
        if (totalTokens > model.contextWindow - 2000) {
            openiaMessages.slice(-8)
        }
        const openaiApiKey = CryptoHelper.decrypt(assistant.openaiApiKey);
        const aiResponder = new ResponseOpenAiChatCompletions(openaiApiKey || "", {
            messages: openiaMessages,
            maxTokens: assistant.maxTokens,
            model: model.name,
            instructions: assistant.instructions
        })

        const aiResponse = await GetAiResponse(aiResponder)
        if (!aiResponse.message) {
            return
        }
        await SendWhatsAppMessage({
            body: aiResponse.message,
            ticket: ticketWitIncludes
        })

    } catch (error) {
        logger.warn(`Error in handleAiMessage: ${error}`)
    }

}