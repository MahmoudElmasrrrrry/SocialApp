"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const types_1 = require("../../utils/errors/types");
const user_repo_1 = require("../../DB/repos/user.repo");
const hash_1 = require("../../utils/security/hash");
class AuthServices {
    userModel = new user_repo_1.UserRepo();
    signup = async (req, res, next) => {
        const { name, email, password } = req.body;
        const isExist = await this.userModel.findByEmail({ email });
        if (isExist) {
            throw new types_1.ApplicationError("User already exists", 409);
        }
        const user = await this.userModel.create({ data: { name, email, password: await (0, hash_1.hashPassword)(password) } });
        return res.json({ user });
    };
}
exports.AuthServices = AuthServices;
