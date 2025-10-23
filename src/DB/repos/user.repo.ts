import { Model, ProjectionFields, QueryOptions } from "mongoose";
import { IUser } from "../../modules/userModules/user.types";
import { DBRepo } from "../DBRepo";
import { UserModel } from "../models/user.model";

export class UserRepo extends DBRepo<IUser> {
    constructor(protected override readonly model : Model<IUser> = UserModel) {
        super(UserModel);
    }  
    findByEmail = async(
        { email, projection = {}, options = {} } :
        { email: string, projection ?: ProjectionFields<IUser>, options ?: QueryOptions<IUser> }
    ) => {
        const doc = await this.model.findOne({ email }, projection, options);
        return doc;
    }
}