import { ChatRepo } from "../../DB/repos/chat.repo";
import { UserRepo } from "../../DB/repos/user.repo";
import { AuthSocket, connectedSockets } from "../gatway/gatway";

export class ChatSocketService {
  private readonly chatModel = new ChatRepo();
  private readonly userModel = new UserRepo();
  sendMessage = async(
    socket: AuthSocket,
    data: {
      content: string;
      sendTo: string;
    }
  ) => {
    const createdBy = socket.user?._id;
    const {content, sendTo} = data
    const to = await this.userModel.findById({id: sendTo});
    const chat = await this.chatModel.findOne({
        filter:{
            group:{
                $exists: false,
            },
            participants:{
                $all:[createdBy, to?._id]
            }
        }
    })

    if(!chat){
        throw new Error('chat not found')
    }

    await chat.updateOne({
        $push:{
            messages:{
                content,
                createdBy
            }
        }
    })

    
    socket.emit('successMessage', content);

    socket.to(connectedSockets.get(to?._id.toString() as string) || []).emit('newMessage', {content, from:{_id: createdBy} });
    
  };
}
