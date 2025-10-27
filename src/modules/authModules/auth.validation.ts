import z, { custom } from 'zod';

export const SignupSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
    age: z.number().optional(),
    phoneNumber: z.string().optional()

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


export const ConfirmEmailSchema = z.object({
    email: z.email(),
    otp: z.string().length(6)
});

export const ResendOTPSchema = z.object({
    email: z.email()
});

export const LoginSchema = z.object({
    email: z.email(),
    password: z.string().min(6)
});