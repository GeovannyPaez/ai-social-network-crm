import Assistant from "../models/Assistant"
import Message from "../models/Message"
import Ticket from "../models/Ticket"
import ShowTicketService from "../services/TicketServices/ShowTicketService"
import SendWhatsAppMessage from "../services/WbotServices/SendWhatsAppMessage"
import { logger } from "../utils/logger"
import GetAiResponse from "./GetAiResponse"
import { ResponseOpenAiChatCompletions } from "./ResponseOpenaiChatCompletions"
import { MessageOpenAI } from "./TokenizerHelper"
import CryptoHelper from "./CryptoHelper"

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
        logger.info(`AI response: ${aiResponse.message} to ticket: ${ticket.id}`)
        await SendWhatsAppMessage({
            body: aiResponse.message,
            ticket: ticketWitIncludes
        })

    } catch (error) {
        logger.warn(`Error in handleAiMessage: ${error}`)
    }

}