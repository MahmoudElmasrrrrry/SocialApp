import { Types } from "mongoose";
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

  joinRoom = async(
    socket: AuthSocket,
    roomId: string
  ) => {
    try {
      const group = await this.chatModel.findOne({
        filter: {
          roomId,
          participants: {
            $in: [socket.user?._id],
          },
          group: {
            $exists: true,
          },
        },
      });
      if (!group) {
        throw new Error('Group not found or access denied');
      }
      socket.join(roomId as string);
    } catch (error) {
      socket.emit('customError', error);
    }
  };

  sendGroupMessage = async(
    socket: AuthSocket,
    {
    content,
    groupId
  }:
  {
  content: string;
  groupId: Types.ObjectId;
  }
  ) => {
    try {
      const user = socket.user;
      const group = await this.chatModel.findOne({
        filter: {
          _id: groupId,
          participants: {
            $in: [user?._id],
          },
          group: {
            $exists: true,
          },
        },
      });

      if (!group) {
        throw new Error('Group not found or access denied');
      }

      await group.updateOne({
        $push: {
          messages: {
            content,
            createdBy: user?._id as Types.ObjectId,
          },
        },
      });

      socket.emit('successMessage', content);
      socket.to(group.roomId as string).emit('newMessage', {
        content,
        from: user,
        groupId
      });

    } catch (error) {
      socket.emit('customError', error);
    }
    };
  }