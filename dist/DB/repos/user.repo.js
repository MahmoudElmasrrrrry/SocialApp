"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepo = void 0;
const DBRepo_1 = require("../DBRepo");
const user_model_1 = require("../models/user.model");
class UserRepo extends DBRepo_1.DBRepo {
    model;
    constructor(model = user_model_1.UserModel) {
        super(user_model_1.UserModel);
        this.model = model;
    }
    findByEmail = async ({ email, projection = {}, options = {} }) => {
        const doc = await this.model.findOne({ email }, projection, options);
        return doc;
    };
}
exports.UserRepo = UserRepo;
