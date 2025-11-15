import type { NextFunction, Request, Response } from "express";
import { confirmEmailDTO, loginDTO, resendOTPDTO, signupDTO } from "./auth.DTO";
import { UserModel } from "../../DB/models/user.model";
import { Model } from "mongoose";
import { HUserDocument, IUser } from "../userModules/user.types";
import {
  ApplicationError,
  ExpiredException,
  InvalidCredentialsException,
  NotFoundException,
  NotValidOTPException,
  NotVerifiedException,
} from "../../utils/errors/types";
import { DBRepo } from "../../DB/DBRepo";
import { UserRepo } from "../../DB/repos/user.repo";
import { hashPassword } from "../../utils/security/hash";
import { successHandler } from "../../utils/successHandler";
import createOTP from "../../utils/email/createOTP";
import { template } from "../../utils/email/generateHTML";
import { EMAIL_EVENTS_Enum, emailEvent } from "../../utils/email/email.events";
import { compare, hash } from "bcrypt";
import { generateToken } from "../../utils/security/token";
import { decodeToken, TOKEN_TYPE_Enum } from "../../middleware/auth.middleware";
import { FriendRequestRepo } from "../../DB/repos/friendRequest.repo";

export class AuthServices {
  private userModel = new UserRepo();
  private friendModel = new FriendRequestRepo();
  signup = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const {
      firstName,
      lastName,
      email,
      password,
      age,
      phoneNumber,
    }: signupDTO = req.body;
    const isExist = await this.userModel.findByEmail({ email });
    if (isExist) {
      throw new ApplicationError("User already exists", 409);
    }

    const OTP = createOTP();

    const user = await this.userModel.create({
      data: {
        firstName,
        lastName,
        email,
        password: await hashPassword(password),
        age: age as number,
        phoneNumber: phoneNumber as string,
        emailOTP: {
          otp: await hash(OTP, 10),
          expireTime: new Date(Date.now() + 10 * 60 * 1000), // OTP valid for 10 minutes
        },
      },
    });

    const html = template({
      otp: OTP,
      name: firstName,
      subject: "Email Verification",
    });
    emailEvent.publish(EMAIL_EVENTS_Enum.VERIFY_EMAIL, {
      to: email,
      subject: "Verify your email",
      html,
    });
    return successHandler({
      res,
      data: user,
      message: "User created successfully",
    });
  };

  confirmEmail = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { email, otp }: confirmEmailDTO = req.body;

    const user = await this.userModel.findByEmail({ email });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.isVerified) {
      throw new ApplicationError("Email already confirmed", 400);
    }

    if (!user.emailOTP.otp) {
      throw new ApplicationError("No OTP found, please request a new one", 400);
    }

    const isExpired = user.emailOTP.expireTime < new Date();
    if (isExpired) {
      throw new ExpiredException("OTP has expired, please request a new one");
    }

    const isvalidOTP = await compare(otp, user.emailOTP.otp);
    if (!isvalidOTP) {
      throw new NotValidOTPException("Invalid OTP, please try again");
    }

    await user.updateOne({
      $unset: {
        emailOTP: "",
      },
      isVerified: true,
    });

    return successHandler({
      res,
      data: null,
      message: "Email confirmed successfully",
    });
  };

  resendOTP = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { email }: resendOTPDTO = req.body;
    const user = await this.userModel.findByEmail({ email });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (user.isVerified) {
      throw new ApplicationError("Email already verified", 400);
    }

    if (!user.emailOTP.otp) {
      throw new ApplicationError("No OTP found, please request a new one", 400);
    }

    const isExpired = user.emailOTP.expireTime < new Date();
    if (!isExpired) {
      throw new ApplicationError(
        "Current OTP is still valid, please check your email",
        400
      );
    }

    const OTP = createOTP();
    const html = template({
      otp: OTP,
      name: user.firstName,
      subject: "Resend Email Verification",
    });
    emailEvent.publish(EMAIL_EVENTS_Enum.VERIFY_EMAIL, {
      to: email,
      subject: "Resend Verify your email",
      html,
    });
    await user.updateOne({
      $set: {
        emailOTP: {
          otp: await hash(OTP, 10),
          expireTime: new Date(Date.now() + 10 * 60 * 1000),
        },
      },
    });

    return successHandler({
      res,
      data: null,
      message: "Resend OTP is sended again successfully",
    });
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { email, password }: loginDTO = req.body;

    const user = await this.userModel.findByEmail({ email });
    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isValidPassword = await compare(password, user.password);
    if (!isValidPassword) {
      throw new InvalidCredentialsException();
    }

    const accessToken = generateToken({
      payload: { _id: user._id },
      signature: process.env.ACCESS_TOKEN_SIGNATURE as string,
      options: { expiresIn: "1h" },
    });

    const refreshToken = generateToken({
      payload: { _id: user._id },
      signature: process.env.REFRESH_TOKEN_SIGNATURE as string,
      options: { expiresIn: "7d" },
    });

    return successHandler({
      res,
      data: {
        accessToken,
        refreshToken,
      },
      message: "Success",
    });
  };

  getUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    let user: HUserDocument = res.locals.user;
    user = await user.populate('friends');
    return successHandler({
      res,
      data: user,
      message: "User profile fetched successfully",
    });
  };

  refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { authorization } = req.headers;
    const user = await decodeToken({
      authorization: authorization as string,
      tokenType: TOKEN_TYPE_Enum.REFRESH,
    });
    const accessToken = generateToken({
      payload: { _id: user._id },
      signature: process.env.ACCESS_TOKEN_SIGNATURE as string,
      options: { expiresIn: "1h" },
    });
    return successHandler({
      res,
      data: {
        accessToken,
      },
      message: "Access token refreshed successfully",
    });
  };

  forgetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { email } = req.body;
    const user = await this.userModel.findByEmail({ email });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    if (!user.isVerified) {
      throw new NotVerifiedException();
    }

    const otp = createOTP();
    const html = template({
      otp: otp,
      name: user.firstName,
      subject: "Reset Password",
    });

    emailEvent.publish(EMAIL_EVENTS_Enum.RESET_PASSWORD, {
      to: email,
      subject: "Reset your password",
      html,
    });

    await user.updateOne({
      $set: {
        resetPasswordOTP: {
          otp: await hash(otp, 10),
          expireTime: new Date(Date.now() + 10 * 60 * 1000),
        },
      },
    });

    return successHandler({
      res,
      data: null,
      message: "Check your email to reset your password",
    });
  };

  resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { email, otp, newPassword } = req.body;
    const user = await this.userModel.findByEmail({ email });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    if (!user.isVerified) {
      throw new NotVerifiedException();
    }

    if (!user.resetPasswordOTP.otp) {
      throw new ApplicationError("No OTP found", 400);
    }

    const isExpired = user.resetPasswordOTP.expireTime < new Date();
    if (isExpired) {
      throw new ExpiredException("OTP has expired, please request a new one");
    }

    const isvalidOTP = await compare(otp, user.resetPasswordOTP.otp);
    if (!isvalidOTP) {
      throw new NotValidOTPException("Invalid OTP, Ensure OTP in your email");
    }
    const hashedNewPassword = await hashPassword(newPassword);
    await user.updateOne({
      $unset: {
        resetPasswordOTP: "",
      },
      password: hashedNewPassword,
      changeCredentialsDate: new Date(),
    });

    return successHandler({
      res,
      data: null,
      message: "Password reset successfully",
    });
  };

  SendFriendRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {

    const authUser : HUserDocument = res.locals.user;
    const {to} = req.body;
    const from = authUser._id;
    
    if(to.toString() == from.toString()){
      throw new ApplicationError("You can not send friend request", 400);
    }

    if(await this.userModel.findById(to)){
      throw new NotFoundException("Recipient user not found");
    }

    const isFriend = await this.friendModel.findOne({
      filter:{
        $or:[
          {from, to},
          {to, from}
        ]
      }
    })

    if(isFriend){
      throw new ApplicationError("You can not send friend request or You are already friends", 400);
    }

    const friendRequest = await this.friendModel.create({
      data:{
        from,
        to
      }
    });



    return successHandler({
      res,
      data: friendRequest,
      message:"Friend request sent successfully"
    });
  };
  
  acceptFriendRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {

    const authUser : HUserDocument = res.locals.user;
    const {id} = req.params as {id:string};
    const friendRequest = await this.friendModel.findOne({
      filter:{
        _id: id,
        to: authUser._id,
        acceptedAt:{
          $exists: false
        } 
      }
    });

    if(!friendRequest){
      throw new NotFoundException("Friend request not found");
    }

    await friendRequest.updateOne({
        acceptedAt: new Date()
    })

    await this.userModel.findOneAndUpdate({
      filter:{_id:friendRequest.to},
      update:{$addToSet:{friends:friendRequest.from}
    }})
    await this.userModel.findOneAndUpdate({
      filter:{_id:friendRequest.from}, 
      update:{$addToSet:{friends:authUser._id}
    }});
    

    


    return successHandler({
      res,
      data: null,
      message: "Friend request accepted successfully",
    });
  };

  
}
