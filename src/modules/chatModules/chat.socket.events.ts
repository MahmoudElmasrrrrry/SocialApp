import { AuthSocket } from "../gatway/gatway";
import { ChatSocketService } from "./chat.socket.service";


export class ChatEvents{
    private readonly chatSocketService = new ChatSocketService()
    sendMessage = async(socket:AuthSocket)=>{
        socket.on('sendMessage', (data)=>{
            this.chatSocketService.sendMessage(socket, data)
        })

    }
    
}