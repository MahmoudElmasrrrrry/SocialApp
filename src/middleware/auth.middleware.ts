import { JwtPayload } from "jsonwebtoken";
import { InvalidTokenException } from "../utils/errors/types";
import { verifyToken } from "../utils/security/token";
import { UserRepo } from "../DB/repos/user.repo";
import { Request, Response, NextFunction } from "express";

export enum TOKEN_TYPE_Enum {
  ACCESS = "ACCESS",
  REFRESH = "REFRESH",
}
const userModel = new UserRepo();
export const decodeToken = async ({
  authorization,
  tokenType = TOKEN_TYPE_Enum.ACCESS,
}: {
  authorization: string;
  tokenType: TOKEN_TYPE_Enum;
}) => {
  if (!authorization) {
    throw new InvalidTokenException();
  }

  if (!authorization.startsWith(process.env.BEARER as string)) {
    throw new InvalidTokenException();
  }
  const token: string = authorization.split(" ")[1] as string;
  const payload: JwtPayload = verifyToken({
    token,
    signature:
      tokenType === TOKEN_TYPE_Enum.ACCESS
        ? (process.env.ACCESS_TOKEN_SIGNATURE as string)
        : (process.env.REFRESH_TOKEN_SIGNATURE as string),
  });

  const user = await userModel.findById({ id: payload._id });
  if (!user) {
    throw new InvalidTokenException();
  }

  if (!user.isVerified) {
    throw new InvalidTokenException("User is not verified");
  }

  return user;
};

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const data = await decodeToken({
    authorization: req.headers.authorization as string,
    tokenType: TOKEN_TYPE_Enum.ACCESS,
  });
  res.locals.user = data;
  return next();
};
