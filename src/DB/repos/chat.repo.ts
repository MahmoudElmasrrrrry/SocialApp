import { Model} from "mongoose";
import { DBRepo } from "../DBRepo";
import { chatModel, IChat } from "../models/chat.model";

export class ChatRepo extends DBRepo<IChat> {
    constructor(protected override readonly model : Model<IChat> = chatModel) {
        super(chatModel);
    }  
}