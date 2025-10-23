import { Router } from "express";
import { AuthServices } from "./auth.services";
import validation from "../../middleware/validation.middleware";
import { SignupSchema } from "./auth.validation";
const router = Router();
const authServices = new AuthServices();

router.post("/signup", validation(SignupSchema), authServices.signup);

export default router;
