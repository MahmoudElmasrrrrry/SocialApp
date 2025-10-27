import z from "zod";
import { ConfirmEmailSchema, LoginSchema, ResendOTPSchema, SignupSchema } from "./auth.validation";

export type signupDTO = z.infer<typeof SignupSchema>;
export type confirmEmailDTO = z.infer<typeof ConfirmEmailSchema>;
export type resendOTPDTO = z.infer<typeof ResendOTPSchema>;
export type loginDTO = z.infer<typeof LoginSchema>;