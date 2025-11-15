import {Router} from "express"
import {ChatService}  from "./chat.service";
import { auth } from "../../middleware/auth.middleware";
const router = Router(
    {
        mergeParams:true
    }
);
const chatService = new ChatService()

router.get('/', auth, chatService.getChat)

export default router