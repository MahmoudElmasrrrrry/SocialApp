import { Router } from "express";
import { AuthServices } from "./auth.services";
import validation from "../../middleware/validation.middleware";
import { ConfirmEmailSchema, LoginSchema, ResendOTPSchema, SignupSchema } from "./auth.validation";
import { auth } from "../../middleware/auth.middleware";
const router = Router();
const authServices = new AuthServices();

router.post("/signup", validation(SignupSchema), authServices.signup);
router.patch("/confirm-email", validation(ConfirmEmailSchema), authServices.confirmEmail);
router.patch("/resend-email-otp", validation(ResendOTPSchema), authServices.resendOTP);
router.post("/login", validation(LoginSchema), authServices.login);
router.get("/get-me", auth, authServices.getUserProfile);
export default router;
