import { AuthSocket } from "../gatway/gatway";
import { ChatSocketService } from "./chat.socket.service";

export class ChatEvents {
  private readonly chatSocketService = new ChatSocketService();
  sendMessage = async (socket: AuthSocket) => {
    socket.on("sendMessage", (data) => {
      this.chatSocketService.sendMessage(socket, data);
    });
  };

  joinRoom = async (socket: AuthSocket) => {
    socket.on("join_room", ({roomId}) => {
      this.chatSocketService.joinRoom(socket, roomId);
    });
  };

  sendGroupMessage = async (socket: AuthSocket) => {
    socket.on("sendGroupMessage", (data) => {
      this.chatSocketService.sendGroupMessage(socket, data);
    });
  };
}
