import Router from "express";
import authRouter from "./authModules/auth.controller"
import chatRouter from "./chatModules/chat.controller"
const router = Router();


router.use("/auth", authRouter);
router.use('/chat', chatRouter)

export default router;