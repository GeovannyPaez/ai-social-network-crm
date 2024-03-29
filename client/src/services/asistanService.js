import { getBackendUrl } from "../config";

export function getAiRespose(messages) {
    return fetch(getBackendUrl() + "aiResponse", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: "application/json, text/plain, */*"
        },
        body: JSON.stringify(messages),
    });
}