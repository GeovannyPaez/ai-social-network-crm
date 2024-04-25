import { getBackendUrl } from "../config";
import api from "./api";

export function getAiRespose(messages, { ticketId = undefined } = {}) {
    const tokenAuth = localStorage.getItem("token");
    const token = tokenAuth.slice(1, -1);
    const url = `${getBackendUrl()}aiResponse`

    if (ticketId) {
        url + `?tiketId=${ticketId}`
    }
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: "application/json, text/plain, */*",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(messages),
    });
}

export async function createAssistant(assistant) {
    const { data } = await api.post("assistants", assistant);
    return data;
}

export async function getAssistant() {
    const { data } = await api.get("assistants");
    return data;
}

export async function updateAssistant(assistant) {
    const { data } = await api.put(`assistants/${assistant.id}`, assistant);
    return data;
}