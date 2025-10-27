import { model, models, Schema } from "mongoose";
import { IUser } from "../../modules/userModules/user.types";

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number, required: true },
    phoneNumber: { type: String, required: true },
    folderId: String,
    isVerified: { type: Boolean, default: false },
    changeCredentialsDate: Date,
    emailOTP: {
      otp: String,
      expireTime: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = models.users || model<IUser>("users", userSchema);
