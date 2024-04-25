import { RequestHandler } from "express";
import * as yup from "yup";
import AppError from "../errors/AppError";
import { AsisstanCreateData, UpdateAssistantData } from "../@types/assistant";
import CreateAssistantService from "../services/AssistantService/CreateAssistantService";
import DeleteAssistantService from "../services/AssistantService/DeleteAssistantSerivce";
import ShowAssistantService from "../services/AssistantService/ShowAssistantService";
import UpdateAssistanService from "../services/AssistantService/UpdateAssistantService";
export const index: RequestHandler = async (req, res) => {
    const assistant = await ShowAssistantService(req.user.parentId)
    return res.json(assistant)
}

export const store: RequestHandler = async (req, res) => {
    const assistantData = req.body as AsisstanCreateData
    assistantData.userParentId = req.user.parentId
    const schema = yup.object().shape({
        name: yup.string().required(),
        instructions: yup.string().required(),
        isActivated: yup.boolean(),
        maxTokens: yup.number().required(),
        idAssistant: yup.string(),
        type: yup.string().required().oneOf(["chat_completions", "assistant"])
    })

    try {
        await schema.validate(assistantData)
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            throw new AppError(error.message)
        }
    }
    const assistant = await CreateAssistantService(assistantData)
    return res.status(201).json(assistant)
}
export const remove: RequestHandler = async (req, res) => {
    const { id } = req.params
    await DeleteAssistantService(id)
    return res.status(204).send()
}

export const update: RequestHandler = async (req, res) => {
    const { id } = req.params
    const assistantData = req.body as UpdateAssistantData
    const schema = yup.object().shape({
        name: yup.string(),
        instructions: yup.string(),
        isActivated: yup.boolean(),
        type: yup.string().oneOf(["chat_completions", "assistant"]),
        maxTokens: yup.number(),
        idAssistant: yup.string(),
        userParentId: yup.number()
    })

    try {
        await schema.validate(assistantData)
    } catch (error) {
        if (error instanceof yup.ValidationError) {
            throw new AppError(error.message)
        }
    }

    const assistant = await UpdateAssistanService({ ...assistantData, id: Number(id), userParentId: req.user.parentId })
    return res.status(201).json(assistant)
}
