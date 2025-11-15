import { Server as HttpServer } from 'http';
import { HydratedDocument } from 'mongoose';
import {Server, Socket} from 'socket.io';
import { IUser } from '../userModules/user.types';
import { decodeToken } from '../../middleware/auth.middleware';
import { ChatGateway } from '../chatModules/chat.gatway';


export interface AuthSocket extends Socket {
    user ?: HydratedDocument<IUser>
}

export const connectedSockets = new Map<string, string[]>();

export const initlazyGetway = async (httpServer: HttpServer) => {
    const registerGateWay = new ChatGateway();
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
        }
    });

    io.use(async (socket:AuthSocket, next) => {
        try {
            const user = await decodeToken({authorization: socket.handshake.auth.authorization as string});
            socket.user = user;
            next();        
        } catch (error) {
            next(new Error("UnAuthorized"));
        }
    });

    io.on("connection", (socket:AuthSocket) => {
        const currentSocket = connectedSockets.get(socket.user?._id.toString() as string) || []
        currentSocket.push(socket.id)
        connectedSockets.set(socket.user?._id.toString()as string, currentSocket);
        console.log({connectedSockets});
        
        registerGateWay.register(socket);
    });

}
