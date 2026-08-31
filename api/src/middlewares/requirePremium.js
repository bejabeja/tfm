import { ForbiddenError } from '../errors/ForbiddenError.js';
import { STAFF_ROLES } from '../utils/roles.js';

export const requirePremium = (userRepository) => async (req, res, next) => {
    if (STAFF_ROLES.includes(req.user?.role)) {
        return next();
    }

    const user = await userRepository.getUserById(req.user?.id);
    if (!user?.isPremium()) {
        return next(new ForbiddenError('This feature requires a premium subscription'));
    }

    next();
};
