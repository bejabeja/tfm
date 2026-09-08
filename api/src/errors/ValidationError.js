import { BaseError } from "./BaseError.js";

export class ValidationError extends BaseError {
    constructor(message = "Validation failed", field = null) {
        super(message, 400);
        this.field = field;
    }
}
