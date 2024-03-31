import api from "./api";

export async function getModels() {
    return (await api.get("models")).data
}