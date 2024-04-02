import { RequestHandler } from "express";
import * as yup from "yup";
import { ResponseOpenAiChatCompletions } from "../helpers/ResponseOpenaiChatCompletions";
import AppError from "../errors/AppError";
import ShowAssistantService from "../services/AssistantService/ShowAssistantService";
import CryptoHelper from "../helpers/CryptoHelper";
import ListMessagesService from "../services/MessageServices/ListMessagesService";
import MapMessagesToAiMessages from "../helpers/MapMessagesToAIMessages";
import { MessageOpenAI } from "../helpers/TokenizerHelper";



export const getAiResponseController: RequestHandler = async (req, res) => {
    const { ticketId } = req.query as { ticketId: string };
    let messages = req.body as MessageOpenAI[];
    const SchemaMessage = yup.object().shape({
        content: yup.string().required(),
        role: yup.string().oneOf(["user", "assistant"]).required()
    });


    if (ticketId) {
        const messagesFromTicket = await ListMessagesService({ ticketId });
        messages = MapMessagesToAiMessages(messagesFromTicket.messages);
    }
    const errors: string[] = [];

    // Verificar la validez de cada mensaje
    messages.forEach((message, index) => {
        try {
            SchemaMessage.validateSync(message, { abortEarly: false });
        } catch (error) {
            if (error instanceof yup.ValidationError) {
                errors.push(`Message at index ${index} is invalid: ${error.errors.join(", ")}`);
            }
        }
    });

    // Si hay errores de validación, enviar una respuesta de error
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    const assistant = await ShowAssistantService(req.user.parentId)
    if (!assistant) {
        throw new AppError("ERR_ASSISTANT_NOT_FOUND", 404)
    }

    const openaiApiKey = CryptoHelper.decrypt(assistant.openaiApiKey);
    const openAiChatCompletions = new ResponseOpenAiChatCompletions(openaiApiKey, {
        model: assistant.model.name,
        messages,
        maxTokens: assistant.maxTokens || 1000,
        instructions: assistant.instructions
    })

    const stream = await openAiChatCompletions.getStreamingResponse();
    if (!stream) {
        throw new AppError("OPENAI_API_ERROR", 500)
    }
    for await (const part of stream) {
        res.write(part.choices[0]?.delta.content || "");
    }
    res.end();
};
