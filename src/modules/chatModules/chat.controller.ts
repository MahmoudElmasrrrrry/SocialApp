import {Router} from "express"
import {ChatService}  from "./chat.service";
import { auth } from "../../middleware/auth.middleware";
const router = Router(
    {
        mergeParams:true
    }
);
const chatService = new ChatService()

router.get('/', auth, chatService.getChat);
router.post('/create-group', auth, chatService.createGroupChat);
router.get('/get-group-chat/:groupId', auth, chatService.getGroupChats);
export default router