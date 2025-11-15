import { AuthSocket } from "../gatway/gatway";
import { ChatEvents } from "./chat.socket.events";



export class ChatGateway{
    private readonly chatEvents = new ChatEvents();
    register(socket: AuthSocket){
        this.chatEvents.sendMessage(socket);
    }
}