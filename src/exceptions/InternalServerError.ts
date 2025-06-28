

export default class InternalServerError extends Error {
    public name = "Internal Server Error";
    public statusCode = 500;
    public cause?: unknown;

    constructor(message?: string, cause?: unknown) {
        super(message);
        this.cause = cause;
    }
}