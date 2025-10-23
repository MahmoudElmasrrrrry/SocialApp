export interface IError extends Error {
  statusCode?: number;
}

export class ApplicationError extends Error {
    constructor(msg: string, statusCode: number, options?: ErrorOptions) {
        super(msg, options);
    }
}
