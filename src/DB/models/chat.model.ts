import mongoose, { HydratedDocument } from "mongoose";
import { model, models, Schema, Types } from "mongoose";

export interface IMessage {
  createdBy: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export interface IChat {
  // O vs O
  participants: Types.ObjectId[];
  messages: IMessage[];

  // O vs M

  group ?: string;
  groupImage ?: string;
  roomId: string;

  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>({
  participants: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: "users",
  },
  messages: {
    type: [messageSchema],
    required: true,
  },
  group: {
    type: String,
  },
  groupImage: {
    type: String,
  },
  roomId: {
    type: String,
  },

  createdBy: { 
  type: mongoose.Schema.Types.ObjectId,
  required: true,
  ref: 'users'
 },
}, 
{
  timestamps:true,
});

export type  HChatDocument = HydratedDocument<IChat>;
export const chatModel = models.chat || model<IChat>("chat", chatSchema); 
