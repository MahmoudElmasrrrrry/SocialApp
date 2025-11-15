import { Model, ProjectionFields, QueryOptions } from "mongoose";
import { IUser } from "../../modules/userModules/user.types";
import { DBRepo } from "../DBRepo";
import { UserModel } from "../models/user.model";
import { FriendRequestModel, IFriendRequest } from "../models/friendRequest.model";

export class FriendRequestRepo extends DBRepo<IFriendRequest> {
    constructor(protected override readonly model : Model<IFriendRequest> = FriendRequestModel) {
        super(FriendRequestModel);
    }  
    
}