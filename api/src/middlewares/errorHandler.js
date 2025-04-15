import * as Sentry from "@sentry/node";
import { BaseError } from "../errors/BaseError.js";
export const errorHandler = (err, req, res, next) => {
    const status = err instanceof BaseError ? err.statusCode : 500;
    Sentry.captureException(err.message);
    res.status(status).json({
        error: err.message || "Internal server error",
    });
}
