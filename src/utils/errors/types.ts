export interface IError extends Error {
  statusCode?: number;
}

export class ApplicationError extends Error {
    constructor(msg: string, statusCode: number, options?: ErrorOptions) {
        super(msg, options);
    }
}


export class NotFoundException extends ApplicationError {
    constructor(msg: string = "Not Found") {
        super(msg, 404);
    }
}

export class ExpiredException extends ApplicationError {
    constructor(msg: string = "OTP Expired") {
        super(msg, 400);
    }
}

export class NotValidOTPException extends ApplicationError {
    constructor(msg: string = "Not Valid OTP") {
        super(msg, 400);
    }
}

export class InvalidCredentialsException extends ApplicationError {
    constructor(msg: string = "Invalid Credentials") {
        super(msg, 401);
    }
}


export class InvalidTokenException extends ApplicationError {
    constructor(msg: string = "Invalid Token") {
        super(msg, 401);
    }   
}