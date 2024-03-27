import Assistant from "../models/Assistant"
import Message from "../models/Message"
import Setting from "../models/Setting"
import Ticket from "../models/Ticket"
import ShowTicketService from "../services/TicketServices/ShowTicketService"
import SendWhatsAppMessage from "../services/WbotServices/SendWhatsAppMessage"
import { logger } from "../utils/logger"
import GetAiResponse from "./GetAiResponse"
import { ResponseOpenAiChatCompletions } from "./ResponseOpenaiChatCompletions"
import { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions"
// import SendWhatsAppMessage from "../services/WbotServices/SendWhatsAppMessage"

type handleAiMessageType = {
    ticket: Ticket
    settings: Setting
    assistant: Assistant
}

export const handleAiMessage = async ({
    ticket,
    settings,
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
        const openiaMessages: ChatCompletionCreateParamsBase["messages"] = lastTenMessages.map(msg => {
            return {
                role: msg.fromMe ? "assistant" : "user",
                content: msg.body
            }
        })
        openiaMessages.push({
            role: "system",
            content: assistant.instructions
        })
        const aiResponder = new ResponseOpenAiChatCompletions(settings.openaiApiKey || "", {
            messages: openiaMessages,
            maxTokens: assistant.maxTokens,
            model: assistant.model,
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