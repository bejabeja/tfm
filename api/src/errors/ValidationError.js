import { BaseError } from "./BaseError.js";

export class ValidationError extends BaseError {
    constructor(message = "Validation failed") {
        super(message, 400);
    }
}
