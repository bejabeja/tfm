import { AuthError } from '../errors/AuthError.js';
import config from '../config/config.js';

// Vercel Cron sends `Authorization: Bearer $CRON_SECRET` automatically once
// CRON_SECRET is set as an env var; this rejects any request that doesn't
// match it, so the scheduled purge endpoint can't be triggered by anyone else.
export const requireCronSecret = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!config.cronSecret || token !== config.cronSecret) {
        return next(new AuthError('Unauthorized'));
    }

    next();
};
