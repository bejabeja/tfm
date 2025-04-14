export class BaseError extends Error {
    constructor(message = "Something went wrong", status = 500) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = status;
    }
}