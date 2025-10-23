import { Model, ProjectionFields, QueryOptions, RootFilterQuery, Types } from "mongoose";
import { IUser as T } from "../modules/userModules/user.types";
import { UserModel } from "./models/user.model";

export abstract class DBRepo<T> {
    constructor( protected model: Model<T>) {
    }

    find = async(
        { filter = {}, projection = {}, options = {} } :
        { filter ?: RootFilterQuery<T>, projection ?: ProjectionFields<T>, options ?: QueryOptions<T> }
    ) => {
        const docs = await this.model.find(filter, projection, options);
        return docs;
    }

    findOne = async(
        { filter = {}, projection = {}, options = {} } :
        { filter ?: RootFilterQuery<T>, projection ?: ProjectionFields<T>, options ?: QueryOptions<T> }
    ) => {
        const doc = await this.model.findOne(filter, projection, options);
        return doc;
    }

    findById = async(
        { id, projection = {}, options = {} } :
        { id: Types.ObjectId | string, projection ?: ProjectionFields<T>, options ?: QueryOptions<T> }
    ) => {
        const doc = await this.model.findById(id, projection, options);
        return doc;
    }

    create = async ({data}: {data: Partial<T>}) => {
        const doc = await this.model.create(data);
        return doc;
    }
    

}
