"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationError = void 0;
class ApplicationError extends Error {
    constructor(msg, statusCode, options) {
        super(msg, options);
    }
}
exports.ApplicationError = ApplicationError;
