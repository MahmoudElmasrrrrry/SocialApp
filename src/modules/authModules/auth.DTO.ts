import z from "zod";
import { SignupSchema } from "./auth.validation";

export type signupDTO = z.infer<typeof SignupSchema>;