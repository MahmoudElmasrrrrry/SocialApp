import { Router } from "express";
import { AuthServices } from "./auth.service";
import validation from "../../middleware/validation.middleware";
import { ConfirmEmailSchema, LoginSchema, ResendOTPSchema, SignupSchema } from "./auth.validation";
import { auth } from "../../middleware/auth.middleware";
import chatRouter from "../chatModules/chat.controller"
const router = Router();
router.use('/:id/chat', chatRouter)
const authServices = new AuthServices();

router.post("/signup", validation(SignupSchema), authServices.signup);
router.patch("/confirm-email", validation(ConfirmEmailSchema), authServices.confirmEmail);
router.patch("/resend-email-otp", validation(ResendOTPSchema), authServices.resendOTP);
router.post("/login", validation(LoginSchema), authServices.login);
router.get("/get-me", auth, authServices.getUserProfile);
router.post("/refresh-token", authServices.refreshToken);
router.post("/forgot-password", authServices.forgetPassword);
router.patch("/reset-password", authServices.resetPassword);
router.patch("/friend-request", auth, authServices.SendFriendRequest);
router.patch("/accept-friend-request/:id", auth, authServices.acceptFriendRequest);

export default router;
