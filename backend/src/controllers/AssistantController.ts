import { RequestHandler } from "express";
import ListAssistantsService from "../services/AssistantService/ListAssistantsService";

export const index: RequestHandler = async (req, res) => {
    const assistants = await ListAssistantsService(req.user.parentId)
    return res.json(assistants)
}

export const store: RequestHandler = async (req, res) => {

}
export const remove: RequestHandler = async (req, res) => { }
export const show: RequestHandler = async (req, res) => { }
export const update: RequestHandler = async (req, res) => { }
