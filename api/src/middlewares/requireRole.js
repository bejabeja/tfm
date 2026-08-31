import { ForbiddenError } from '../errors/ForbiddenError.js';

export const requireRole = (...allowedRoles) => (req, res, next) => {
    if (!allowedRoles.includes(req.user?.role)) {
        return next(new ForbiddenError('Forbidden: insufficient permissions'));
    }
    next();
};
