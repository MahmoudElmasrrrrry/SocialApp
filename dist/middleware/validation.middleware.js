"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation = (Schema) => {
    return async (req, res, next) => {
        const data = {
            ...req.body,
            ...req.params,
            ...req.query,
        };
        const validationResult = await Schema.safeParseAsync(data);
        if (!validationResult.success) {
            return res.status(422).json({ validationErrors: JSON.parse(validationResult.error) });
        }
        next();
    };
};
exports.default = validation;
