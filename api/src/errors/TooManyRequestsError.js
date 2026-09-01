import { BaseError } from "./BaseError.js";

export class TooManyRequestsError extends BaseError {
    constructor(message = "Too many requests") {
        super(message, 429);
    }
}
