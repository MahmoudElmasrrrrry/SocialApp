import { HydratedDocument } from "mongoose";

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
  }
}

export type HUserDocument = HydratedDocument<IUser>;