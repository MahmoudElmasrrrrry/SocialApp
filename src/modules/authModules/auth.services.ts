import type { NextFunction, Request, Response } from "express";
import { signupDTO } from "./auth.DTO";
import { UserModel } from "../../DB/models/user.model";
import { Model } from "mongoose";
import { IUser } from "../userModules/user.types";
import { ApplicationError } from "../../utils/errors/types";
import { DBRepo } from "../../DB/DBRepo";
import { UserRepo } from "../../DB/repos/user.repo";
import { hashPassword } from "../../utils/security/hash";

export class AuthServices {
  private userModel = new UserRepo();
  signup = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    const { name, email, password }: signupDTO = req.body;
    const isExist = await this.userModel.findByEmail({ email });
    if (isExist) {
      throw new ApplicationError("User already exists", 409);
    }
    const user = await this.userModel.create({ data: { name, email, password: await hashPassword(password) } });
    return res.json({ user });
  }
}
