import openSocket from "socket.io-client";
import { getBackendUrl } from "../config";

function connectToSocket() {
    return openSocket(getBackendUrl(), {
        auth: {
            parentId: localStorage.getItem("parentId")
        }
    });
}

export default connectToSocket;