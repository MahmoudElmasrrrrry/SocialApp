import { ZodObject } from "zod";
import type { NextFunction, Request, Response } from "express";

const validation = (Schema: ZodObject) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const data = {
            ...req.body,
            ...req.params,
            ...req.query,
        };
        const validationResult = await Schema.safeParseAsync(data);
        if (!validationResult.success) {
            return res.status(422).json({ validationErrors: JSON.parse(validationResult.error as unknown as string) });
        }
        next();
    };
};
export default validation;