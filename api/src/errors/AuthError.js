import { BaseError } from "./BaseError.js";

export class AuthError extends BaseError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}