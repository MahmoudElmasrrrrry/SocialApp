import { HydratedDocument, Types } from "mongoose";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age: number;
  phoneNumber: string;
  profilePicture: string;
  coverPicture: string[];
  createdAt: Date;
  updatedAt: Date;
  folderId: string;
  isVerified: boolean;
  changeCredentialsDate: Date;
  emailOTP:{
    otp: string;
    expireTime: Date;
  };
  resetPasswordOTP:{
    otp: string;
    expireTime: Date;
  };
  friends: Types.ObjectId[];
}

export type HUserDocument = HydratedDocument<IUser>;