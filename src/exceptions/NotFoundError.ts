
export default class NotFoundError extends Error {
    public name = "Not Found Error"
    public statusCode: number;

    constructor(message?: string, code = 404) {
        super(message);
        this.statusCode = code;
    }
}