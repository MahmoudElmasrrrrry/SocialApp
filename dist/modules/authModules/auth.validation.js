"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.SignupSchema = zod_1.default.object({
    email: zod_1.default.email(),
    name: zod_1.default.string(),
    password: zod_1.default.string().min(6),
    confirmPassword: zod_1.default.string(),
}).superRefine((obj, ctx) => {
    if (obj.password !== obj.confirmPassword) {
        ctx.addIssue({
            code: "custom",
            message: "Passwords do not match",
            path: ["confirmPassword", "password"]
        });
    }
    if (!obj.email.startsWith("mahmoud")) {
        ctx.addIssue({
            code: "custom",
            message: "Email must start with 'mahmoud'",
            path: ["email"]
        });
    }
});
// }).refine((args)=>{
//     return args.password == args.confirmPassword
// },{
//     error: "Passwords do not match",
//     path: ["confirmPassword", "password"]
// })
// .refine((args)=>{
//     return args.email.startsWith("user@")
// },{
//     error: "Email must start with 'user@'",
//     path: ["name"]
// });
