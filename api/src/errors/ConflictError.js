import { BaseError } from "./BaseError.js";

export class ConflictError extends BaseError {
    constructor(message = "Conflict", field = null) {
        super(message, 409);
        this.field = field;
    }
}