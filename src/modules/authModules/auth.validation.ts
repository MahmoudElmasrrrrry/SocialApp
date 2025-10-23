import z, { custom } from 'zod';

export const SignupSchema = z.object({
    email: z.email(),
    name: z.string(),
    password: z.string().min(6),
    confirmPassword: z.string(),
}).superRefine((obj, ctx)=>{
    if(obj.password !== obj.confirmPassword){
        ctx.addIssue({
            code: "custom",
            message: "Passwords do not match",
            path: ["confirmPassword", "password"]
        });
    }

    if(!obj.email.startsWith("mahmoud")){
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