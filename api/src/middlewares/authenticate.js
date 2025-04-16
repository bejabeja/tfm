import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import { AuthError } from '../errors/AuthError.js';

export const authenticate = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(new AuthError('Unauthorized'));
    }

    try {
        const data = jwt.verify(token, config.jwtSecret);
        req.user = data;
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        return next(new AuthError('Unauthorized'));
    }

    next();
}